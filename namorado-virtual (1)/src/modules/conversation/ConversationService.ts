import {
  Avatar,
  Conversation,
  ConversationEnginePayload,
  ConversationEngineResult,
  EngineConfig,
  IConversationEngine,
  Persona,
  UserProfile,
} from '../../types';
import { GeminiEngine } from './engines/GeminiEngine';
import { LocalGGUFEngine } from './engines/LocalGGUFEngine';
import { OfflineSimulatedEngine } from './engines/OfflineSimulatedEngine';
import { MemoryService } from '../memory/MemoryService';

export class ConversationService {
  private activeEngine: IConversationEngine;
  private engines: Map<string, IConversationEngine> = new Map();
  private currentConfig: EngineConfig;
  private memoryService?: MemoryService;

  constructor(initialConfig: EngineConfig, memoryService?: MemoryService) {
    this.currentConfig = initialConfig;
    this.memoryService = memoryService;
    
    // Register available engines
    this.engines.set('gemini', new GeminiEngine());
    this.engines.set('local_gguf', new LocalGGUFEngine());
    this.engines.set('offline_simulated', new OfflineSimulatedEngine());
    this.engines.set('custom_rest', new LocalGGUFEngine()); // compatible endpoint

    this.activeEngine = this.engines.get(initialConfig.provider) || this.engines.get('gemini')!;
    this.activeEngine.initialize(initialConfig);
  }

  public setEngine(config: EngineConfig) {
    this.setEngineConfig(config);
  }

  public setEngineConfig(config: EngineConfig) {
    this.currentConfig = config;
    const selected = this.engines.get(config.provider) || this.engines.get('offline_simulated')!;
    this.activeEngine = selected;
    this.activeEngine.initialize(config);
  }

  public getActiveEngineName(): string {
    return this.activeEngine.providerName;
  }

  public async processUserMessage(
    text: string,
    persona: Persona,
    avatar: Avatar,
    user: UserProfile,
    conversation: Conversation
  ): Promise<ConversationEngineResult & { detectedMemory?: string }> {
    const memoryItems = this.memoryService ? this.memoryService.getMemoriesForPersona(persona.id) : [];

    const payload: ConversationEnginePayload = {
      message: text,
      history: conversation.messages || [],
      persona,
      avatar,
      user,
      memoryItems,
      affectionLevel: conversation.affectionScore || 30,
      relationshipStatus: persona.relationshipStage,
    };

    const result = await this.sendMessage(payload);

    let detectedMemoryText: string | undefined;

    // Persist new memories if returned by the engine
    if (result.newMemories && result.newMemories.length > 0 && this.memoryService) {
      for (const mem of result.newMemories) {
        this.memoryService.addMemoryItem({
          userId: user.id,
          personaId: persona.id,
          category: mem.category,
          key: mem.category,
          value: mem.value,
          importance: 3,
          confidence: 0.95,
          sourceMessageText: text,
        });
        detectedMemoryText = mem.value;
      }
    }

    return {
      ...result,
      detectedMemory: detectedMemoryText,
    };
  }

  public async sendMessage(payload: ConversationEnginePayload): Promise<ConversationEngineResult> {
    try {
      if (this.currentConfig.isOfflineMode) {
        const offlineEngine = this.engines.get('offline_simulated')!;
        return await offlineEngine.sendMessage(payload);
      }

      return await this.activeEngine.sendMessage(payload);
    } catch (err) {
      console.warn('Active engine failed, gracefully falling back to Offline Simulated Engine:', err);
      const fallback = this.engines.get('offline_simulated')!;
      const res = await fallback.sendMessage(payload);
      return {
        ...res,
        source: `${res.source} (fallback automático)`,
      };
    }
  }

  public calculateNewAffection(currentScore: number, delta: number): number {
    return Math.min(100, Math.max(0, currentScore + delta));
  }

  public calculateIntimacyLevel(affectionScore: number, totalMessages: number): number {
    if (affectionScore >= 80 && totalMessages >= 40) return 5; // Apaixonados / Noivos
    if (affectionScore >= 60 && totalMessages >= 25) return 4; // Namorando
    if (affectionScore >= 40 && totalMessages >= 12) return 3; // Ficando firme
    if (affectionScore >= 20 && totalMessages >= 5) return 2;  // Paquerando
    return 1; // Conhecendo
  }
}
