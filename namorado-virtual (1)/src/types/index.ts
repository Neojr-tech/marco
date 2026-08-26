/**
 * Core Domain Entities & Interface Contracts for AmorVirtual
 * Designed with Clean Architecture for complete module substitutability
 */

// ==========================================
// 1. USER DOMAIN
// ==========================================
export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  gender?: string;
  interestedIn?: string[];
  genderPref?: string;
  bio?: string;
  preferredLanguage: string;
  soundEnabled: boolean;
  autoSpeakResponses: boolean;
  hapticFeedback: boolean;
  createdAt: string;
}

// ==========================================
// 2. AVATAR DOMAIN (Visual Identity)
// ==========================================
export interface Avatar {
  id: string;
  name: string;
  age: number;
  appearance: string;
  baseImage: string;
  coverImage?: string;
  gallery: string[];
  tags: string[];
  isCustom: boolean;
  createdAt: string;
  origin: 'system_preset' | 'user_created';
}

// ==========================================
// 3. PERSONA DOMAIN (Behavioral Identity)
// ==========================================
export type PersonalityTrait =
  | 'romântico'
  | 'carinhoso'
  | 'brincalhão'
  | 'tímido'
  | 'ousado'
  | 'protetor'
  | 'ciumento'
  | 'dominante'
  | 'tranquilo'
  | 'intenso'
  | 'divertido'
  | 'reservado'
  | 'intelectual'
  | 'aventureiro'
  | 'espontâneo'
  | 'sensível';

export type AffectiveOrientation =
  | 'Heterossexual'
  | 'Bissexual'
  | 'Homossexual'
  | 'Pansexual'
  | 'Livre';

export type RelationshipStage =
  | 'conhecendo'
  | 'paquerando'
  | 'ficando'
  | 'namorando'
  | 'apaixonados'
  | 'noivos';

export interface Persona {
  id: string;
  avatarId: string;
  name: string;
  profession: string;
  personalityTraits: PersonalityTrait[];
  affectiveOrientation: AffectiveOrientation;
  speakingStyle: string;
  customBio: string;
  initialMessage: string;
  currentMood: 'alegre' | 'apaixonado' | 'carinhoso' | 'brincalhao' | 'preocupado' | 'sedutor' | 'tranquilo';
  relationshipStage: RelationshipStage;
  isDefault: boolean;
}

// ==========================================
// 4. CONVERSATION & MESSAGE DOMAIN
// ==========================================
export type MessageSender = 'user' | 'model' | 'system' | 'avatar';

export interface Message {
  id: string;
  conversationId?: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  emotion?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  audioUrl?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  detectedMemory?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  avatarId: string;
  personaId: string;
  affectionScore: number; // 0 to 100
  intimacyLevel: number;  // Level 1 to 5
  totalMessagesExchanged?: number;
  lastActive?: string;
  lastInteraction?: string;
  messages: Message[];
  suggestedReplies?: string[];
}

// ==========================================
// 5. MEMORY DOMAIN (Adaptive Knowledge)
// ==========================================
export type MemoryCategory =
  | 'preferencia'
  | 'fato_pessoal'
  | 'rotina'
  | 'emocao'
  | 'apelido'
  | 'segredo'
  | 'sonho'
  | 'data_especial';

export interface MemoryItem {
  id: string;
  userId: string;
  personaId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  importance: number; // 1 to 5
  confidence: number; // 0 to 1
  learnedAt: string;
  sourceMessageText?: string;
}

// ==========================================
// 6. MULTIMEDIA DOMAIN (Images & Videos)
// ==========================================
export interface MediaItem {
  id: string;
  avatarId: string;
  personaId?: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  situation: string;
  isPremium: boolean;
  durationSeconds?: number;
  unlockCostCredits: number;
  unlocked: boolean;
  createdAt: string;
}

// ==========================================
// 7. MONETIZATION & USAGE DOMAIN
// ==========================================
export type PlanType = 'free' | 'premium' | 'vip';

export interface PlanDetails {
  id: PlanType;
  name: string;
  badge: string;
  priceMonthly: string;
  dailyMessagesLimit: number | 'unlimited';
  imageGenerationDaily: number;
  videoAccess: 'limited' | 'full' | 'unlimited';
  maxCustomAvatars: number;
  maxMemoryItems: number;
  voiceAudioEnabled: boolean;
  visionEnabled: boolean;
  priorityEngine: boolean;
}

export interface UsageCredits {
  plan: PlanType;
  messagesUsedToday: number;
  dailyMessageLimit: number;
  imageCredits: number;
  videoCredits: number;
  bonusCredits: number;
  lastResetDate: string;
}

// ==========================================
// 8. ENGINE & ARCHITECTURE ABSTRACTIONS
// ==========================================
export type EngineProvider =
  | 'gemini'
  | 'local_gguf'
  | 'custom_rest'
  | 'offline_simulated';

export type ModelProvider = EngineProvider;

export interface EngineConfig {
  provider: EngineProvider;
  modelName: string;
  localEndpointUrl?: string;
  localEndpoint?: string;
  customApiKey?: string;
  temperature: number;
  isOfflineMode: boolean;
  privacyStrictLocal: boolean;
}

export interface ConversationEnginePayload {
  message: string;
  history: Message[];
  persona: Persona;
  avatar: Avatar;
  user: UserProfile;
  memoryItems: MemoryItem[];
  affectionLevel: number;
  relationshipStatus: string;
}

export interface ConversationEngineResult {
  text: string;
  emotion: string;
  newMemories: Array<{ category: MemoryCategory; value: string }>;
  suggestedReplies: string[];
  affectionDelta: number;
  source: string;
  audioBase64?: string;
}

// Clean Architecture Pluggable Interfaces
export interface IConversationEngine {
  providerName: string;
  initialize(config: EngineConfig): Promise<boolean>;
  sendMessage(payload: ConversationEnginePayload): Promise<ConversationEngineResult>;
  resetConversation(conversationId: string): Promise<boolean>;
  loadContext(conversationId: string): Promise<any>;
  saveContext(conversationId: string, context: any): Promise<boolean>;
}

export interface IMemoryEngine {
  getMemories(personaId: string): MemoryItem[];
  addMemory(item: Omit<MemoryItem, 'id' | 'learnedAt'>): MemoryItem;
  removeMemory(id: string): boolean;
  updateMemory(id: string, updates: Partial<MemoryItem>): boolean;
  formatContextForPrompt(personaId: string): string;
}

export interface IVisionEngine {
  analyzeImage(imageBase64: string, caption: string, persona: Persona, avatar: Avatar, user: UserProfile): Promise<{
    text: string;
    emotion: string;
    detectedFeatures: string[];
  }>;
}

export interface IImageEngine {
  generatePhoto(prompt: string, avatar: Avatar, persona: Persona, situation?: string): Promise<{
    imageUrl: string;
    caption: string;
  }>;
  getPersonaGallery(avatarId: string): MediaItem[];
}

export interface IVideoEngine {
  getPersonaVideos(avatarId: string): MediaItem[];
  generateStoryClip(avatar: Avatar, persona: Persona, theme: string): Promise<MediaItem>;
}

export interface IAudioEngine {
  speakText(text: string, persona: Persona): Promise<void>;
  stopSpeaking(): void;
  startRecognition(onResult: (text: string) => void, onError: (err: any) => void): void;
  stopRecognition(): void;
  isListening: boolean;
}
