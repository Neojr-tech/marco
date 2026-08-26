import { IMemoryEngine, MemoryCategory, MemoryItem } from '../../types';

export class MemoryService implements IMemoryEngine {
  private memories: MemoryItem[] = [];

  constructor(initialMemories: MemoryItem[] = []) {
    this.memories = initialMemories;
  }

  public setMemories(memories: MemoryItem[]) {
    this.memories = memories;
  }

  public getAllMemories(): MemoryItem[] {
    return [...this.memories];
  }

  public getMemories(personaId: string): MemoryItem[] {
    return this.memories.filter(
      (m) => m.personaId === personaId || m.personaId === 'global'
    );
  }

  public getMemoriesByCategory(personaId: string, category: MemoryCategory): MemoryItem[] {
    return this.getMemories(personaId).filter((m) => m.category === category);
  }

  public getMemoriesForPersona(personaId: string): MemoryItem[] {
    return this.getMemories(personaId);
  }

  public addMemoryItem(item: Omit<MemoryItem, 'id' | 'learnedAt'>): MemoryItem {
    return this.addMemory(item);
  }

  public deleteMemoryItem(id: string): boolean {
    return this.removeMemory(id);
  }

  public addMemory(item: Omit<MemoryItem, 'id' | 'learnedAt'>): MemoryItem {
    // Avoid duplicate memories with exact same value
    const existing = this.memories.find(
      (m) => m.personaId === item.personaId && m.value.toLowerCase() === item.value.toLowerCase()
    );
    if (existing) {
      existing.confidence = Math.min(1.0, existing.confidence + 0.2);
      existing.importance = Math.min(5, existing.importance + 1);
      return existing;
    }

    const newMemory: MemoryItem = {
      ...item,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      learnedAt: new Date().toISOString(),
    };

    this.memories.unshift(newMemory);
    return newMemory;
  }

  public removeMemory(id: string): boolean {
    const initialLen = this.memories.length;
    this.memories = this.memories.filter((m) => m.id !== id);
    return this.memories.length < initialLen;
  }

  public updateMemory(id: string, updates: Partial<MemoryItem>): boolean {
    const memory = this.memories.find((m) => m.id === id);
    if (!memory) return false;
    Object.assign(memory, updates);
    return true;
  }

  public formatContextForPrompt(personaId: string): string {
    const personaMemories = this.getMemories(personaId).slice(0, 15);
    if (personaMemories.length === 0) {
      return 'Nenhuma memória de longo prazo registrada ainda.';
    }

    return personaMemories
      .map((m) => `• [${m.category.toUpperCase()}]: ${m.value}`)
      .join('\n');
  }

  public getMemoryStats(personaId: string) {
    const items = this.getMemories(personaId);
    return {
      total: items.length,
      categoriesCount: {
        preferencia: items.filter((m) => m.category === 'preferencia').length,
        fato_pessoal: items.filter((m) => m.category === 'fato_pessoal').length,
        rotina: items.filter((m) => m.category === 'rotina').length,
        emocao: items.filter((m) => m.category === 'emocao').length,
        apelido: items.filter((m) => m.category === 'apelido').length,
        segredo: items.filter((m) => m.category === 'segredo').length,
        sonho: items.filter((m) => m.category === 'sonho').length,
        data_especial: items.filter((m) => m.category === 'data_especial').length,
      },
    };
  }
}
