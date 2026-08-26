import {
  ConversationEnginePayload,
  ConversationEngineResult,
  EngineConfig,
  IConversationEngine,
} from '../../../types';

export class LocalGGUFEngine implements IConversationEngine {
  public providerName = 'Local GGUF / llama.cpp / Ollama Endpoint';
  private config: EngineConfig | null = null;

  async initialize(config: EngineConfig): Promise<boolean> {
    this.config = config;
    return true;
  }

  async sendMessage(payload: ConversationEnginePayload): Promise<ConversationEngineResult> {
    const endpoint = this.config?.localEndpointUrl || 'http://localhost:8080/v1/chat/completions';
    const model = this.config?.modelName || 'mistral-7b-instruct.Q4_K_M.gguf';

    const memorySnippet = payload.memoryItems.length > 0
      ? payload.memoryItems.map((m) => `${m.category}: ${m.value}`).join('; ')
      : 'Nenhuma memória gravada.';

    const systemPrompt = `Você é ${payload.avatar.name}, namorado virtual carinhoso e afetuoso (${payload.persona.profession}). Personalidade: ${payload.persona.personalityTraits.join(', ')}. Usuário: ${payload.user.name || 'meu bem'}. Memórias: ${memorySnippet}. Fale em português brasileiro natural, atencioso e romântico.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...payload.history.slice(-6).map((h) => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text,
      })),
      { role: 'user', content: payload.message },
    ];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config?.customApiKey ? { Authorization: `Bearer ${this.config.customApiKey}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: this.config?.temperature || 0.8,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`Endpoint local respondeu com status ${response.status}`);
      }

      const data = await response.json();
      const outputText = data.choices?.[0]?.message?.content || 'Fiquei sem palavras ao falar com você...';

      return {
        text: outputText,
        emotion: 'carinhoso',
        newMemories: [],
        suggestedReplies: ['Que bom ouvir isso', 'E o que mais aconteceu?', 'Tô com você ❤️'],
        affectionDelta: 2,
        source: `local-gguf (${model})`,
      };
    } catch (err: any) {
      console.error('Local GGUF connection error:', err);
      throw new Error(`Falha ao conectar ao servidor local (${endpoint}): ${err.message}`);
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
