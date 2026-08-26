import {
  ConversationEnginePayload,
  ConversationEngineResult,
  EngineConfig,
  IConversationEngine,
} from '../../../types';

export class GeminiEngine implements IConversationEngine {
  public providerName = 'Google Gemini 3.7 Flash (Cloud Server)';
  private config: EngineConfig | null = null;

  async initialize(config: EngineConfig): Promise<boolean> {
    this.config = config;
    return true;
  }

  async sendMessage(payload: ConversationEnginePayload): Promise<ConversationEngineResult> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: payload.message,
          history: payload.history,
          persona: payload.persona,
          avatar: payload.avatar,
          user: payload.user,
          memoryItems: payload.memoryItems,
          affectionLevel: payload.affectionLevel,
          relationshipStatus: payload.relationshipStatus,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      return {
        text: data.text || 'Adorei conversar com você...',
        emotion: data.emotion || 'carinhoso',
        newMemories: data.newMemories || [],
        suggestedReplies: data.suggestedReplies || ['Também pensei em você', 'Como foi seu dia?', 'Me conta mais ❤️'],
        affectionDelta: data.affectionDelta ?? 2,
        source: data.source || 'gemini-3.7-flash',
        audioBase64: data.audioBase64,
      };
    } catch (err: any) {
      console.warn('Gemini API call failed, invoking resilient local fallback:', err);
      throw err;
    }
  }

  async resetConversation(_conversationId: string): Promise<boolean> {
    return true;
  }

  async loadContext(_conversationId: string): Promise<any> {
    return null;
  }

  async saveContext(_conversationId: string, _context: any): Promise<boolean> {
    return true;
  }
}
