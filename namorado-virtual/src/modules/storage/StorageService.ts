import {
  Avatar,
  Conversation,
  EngineConfig,
  MediaItem,
  MemoryItem,
  Persona,
  UsageCredits,
  UserProfile,
} from '../../types';
import {
  DEFAULT_USER,
  PRESET_AVATARS,
  PRESET_MEDIA,
  PRESET_PERSONAS,
} from '../../data/initialData';

const STORAGE_KEYS = {
  USER: 'amorvirtual_user_v1',
  AVATARS: 'amorvirtual_avatars_v1',
  PERSONAS: 'amorvirtual_personas_v1',
  CONVERSATIONS: 'amorvirtual_conversations_v1',
  MEMORIES: 'amorvirtual_memories_v1',
  MEDIA: 'amorvirtual_media_v1',
  USAGE: 'amorvirtual_usage_v1',
  ENGINE_CONFIG: 'amorvirtual_engine_config_v1',
  ACTIVE_AVATAR: 'amorvirtual_active_avatar_id',
  ACTIVE_PERSONA: 'amorvirtual_active_persona_id',
};

export class StorageService {
  public static loadUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  public static saveUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Save user failed', e);
    }
  }

  public static loadAvatars(): Avatar[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AVATARS);
      if (!data) return PRESET_AVATARS;
      const parsed: Avatar[] = JSON.parse(data);
      // Ensure preset avatars are merged if missing
      const presetIds = new Set(parsed.map((a) => a.id));
      for (const preset of PRESET_AVATARS) {
        if (!presetIds.has(preset.id)) {
          parsed.push(preset);
        }
      }
      return parsed;
    } catch {
      return PRESET_AVATARS;
    }
  }

  public static saveAvatars(avatars: Avatar[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.AVATARS, JSON.stringify(avatars));
    } catch (e) {
      console.error('Save avatars failed', e);
    }
  }

  public static loadPersonas(): Persona[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERSONAS);
      if (!data) return PRESET_PERSONAS;
      const parsed: Persona[] = JSON.parse(data);
      const presetIds = new Set(parsed.map((p) => p.id));
      for (const preset of PRESET_PERSONAS) {
        if (!presetIds.has(preset.id)) {
          parsed.push(preset);
        }
      }
      return parsed;
    } catch {
      return PRESET_PERSONAS;
    }
  }

  public static savePersonas(personas: Persona[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(personas));
    } catch (e) {
      console.error('Save personas failed', e);
    }
  }

  public static loadConversations(): Record<string, Conversation> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public static saveConversations(conversations: Record<string, Conversation>) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.error('Save conversations failed', e);
    }
  }

  public static loadMemories(): MemoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveMemories(memories: MemoryItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.error('Save memories failed', e);
    }
  }

  public static loadMedia(): MediaItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return data ? JSON.parse(data) : PRESET_MEDIA;
    } catch {
      return PRESET_MEDIA;
    }
  }

  public static saveMedia(media: MediaItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
    } catch (e) {
      console.error('Save media failed', e);
    }
  }

  public static loadUsage(): UsageCredits {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USAGE);
      return data
        ? JSON.parse(data)
        : {
            plan: 'free',
            messagesUsedToday: 0,
            dailyMessageLimit: 50,
            imageCredits: 5,
            videoCredits: 3,
            bonusCredits: 10,
            lastResetDate: new Date().toISOString().split('T')[0],
          };
    } catch {
      return {
        plan: 'free',
        messagesUsedToday: 0,
        dailyMessageLimit: 50,
        imageCredits: 5,
        videoCredits: 3,
        bonusCredits: 10,
        lastResetDate: new Date().toISOString().split('T')[0],
      };
    }
  }

  public static saveUsage(usage: UsageCredits) {
    try {
      localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
    } catch (e) {
      console.error('Save usage failed', e);
    }
  }

  public static loadEngineConfig(): EngineConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENGINE_CONFIG);
      return data
        ? JSON.parse(data)
        : {
            provider: 'gemini',
            modelName: 'gemini-3.7-flash',
            temperature: 0.9,
            isOfflineMode: false,
            privacyStrictLocal: false,
          };
    } catch {
      return {
        provider: 'gemini',
        modelName: 'gemini-3.7-flash',
        temperature: 0.9,
        isOfflineMode: false,
        privacyStrictLocal: false,
      };
    }
  }

  public static saveEngineConfig(config: EngineConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.ENGINE_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Save engine config failed', e);
    }
  }

  public static exportAllData(): string {
    const bundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: this.loadUser(),
      avatars: this.loadAvatars(),
      personas: this.loadPersonas(),
      conversations: this.loadConversations(),
      memories: this.loadMemories(),
      media: this.loadMedia(),
      usage: this.loadUsage(),
      engineConfig: this.loadEngineConfig(),
    };
    return JSON.stringify(bundle, null, 2);
  }

  public static importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.user) this.saveUser(parsed.user);
      if (parsed.avatars) this.saveAvatars(parsed.avatars);
      if (parsed.personas) this.savePersonas(parsed.personas);
      if (parsed.conversations) this.saveConversations(parsed.conversations);
      if (parsed.memories) this.saveMemories(parsed.memories);
      if (parsed.media) this.saveMedia(parsed.media);
      if (parsed.usage) this.saveUsage(parsed.usage);
      if (parsed.engineConfig) this.saveEngineConfig(parsed.engineConfig);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public static clearAllData() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Clear failed', e);
    }
  }
}
