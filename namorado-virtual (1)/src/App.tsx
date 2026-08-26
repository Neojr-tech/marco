/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Conversation,
  EngineConfig,
  MediaItem,
  MemoryItem,
  Persona,
  PlanType,
  UsageCredits,
  UserProfile,
} from './types';
import { StorageService } from './modules/storage/StorageService';
import { ConversationService } from './modules/conversation/ConversationService';
import { MemoryService } from './modules/memory/MemoryService';
import { VisionService } from './modules/vision/VisionService';
import { ImageService } from './modules/image/ImageService';
import { VideoService } from './modules/video/VideoService';
import { AudioService } from './modules/audio/AudioService';
import { MonetizationService } from './modules/monetization/MonetizationService';

import { Header } from './components/common/Header';
import { ChatScreen } from './components/chat/ChatScreen';
import { CharacterCatalog } from './components/characters/CharacterCatalog';
import { CharacterDetailModal } from './components/characters/CharacterDetailModal';
import { CustomAvatarModal } from './components/characters/CustomAvatarModal';
import { MemoryDashboard } from './components/memory/MemoryDashboard';
import { MultimediaHub } from './components/multimedia/MultimediaHub';
import { PlansModal } from './components/monetization/PlansModal';
import { EngineSettingsModal } from './components/settings/EngineSettingsModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

import {
  MessageSquare,
  Users,
  Brain,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Heart,
  Crown,
} from 'lucide-react';

type TabType = 'chat' | 'characters' | 'memory' | 'multimedia' | 'settings';

export default function App() {
  // 1. Initial State from StorageService
  const [user, setUser] = useState<UserProfile>(() => StorageService.loadUser());
  const [avatars, setAvatars] = useState<Avatar[]>(() => StorageService.loadAvatars());
  const [personas, setPersonas] = useState<Persona[]>(() => StorageService.loadPersonas());
  const [conversations, setConversations] = useState<Record<string, Conversation>>(() =>
    StorageService.loadConversations()
  );
  const [memories, setMemories] = useState<MemoryItem[]>(() => StorageService.loadMemories());
  const [media, setMedia] = useState<MediaItem[]>(() => StorageService.loadMedia());
  const [usage, setUsage] = useState<UsageCredits>(() => StorageService.loadUsage());
  const [engineConfig, setEngineConfig] = useState<EngineConfig>(() =>
    StorageService.loadEngineConfig()
  );

  // Active selections
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [activeAvatarId, setActiveAvatarId] = useState<string>(() => {
    const saved = localStorage.getItem('amorvirtual_active_avatar_id');
    return saved && avatars.some((a) => a.id === saved) ? saved : avatars[0]?.id || 'avatar_lucas';
  });

  // UI Modals state
  const [isCharacterDetailOpen, setIsCharacterDetailOpen] = useState(false);
  const [selectedDetailAvatar, setSelectedDetailAvatar] = useState<Avatar | null>(null);
  const [isCustomAvatarModalOpen, setIsCustomAvatarModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isEngineSettingsOpen, setIsEngineSettingsOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 2. Services References
  const memoryServiceRef = useRef<MemoryService>(new MemoryService(memories));
  const conversationServiceRef = useRef<ConversationService>(
    new ConversationService(engineConfig, memoryServiceRef.current)
  );
  const visionServiceRef = useRef<VisionService>(new VisionService());
  const imageServiceRef = useRef<ImageService>(new ImageService(media));
  const videoServiceRef = useRef<VideoService>(new VideoService(media));
  const audioServiceRef = useRef<AudioService>(new AudioService());
  const monetizationServiceRef = useRef<MonetizationService>(new MonetizationService(usage));

  // Current active avatar & persona derived
  const activeAvatar = avatars.find((a) => a.id === activeAvatarId) || avatars[0];
  const activePersona =
    personas.find((p) => p.avatarId === activeAvatar.id) ||
    personas[0] || {
      id: 'persona_default',
      avatarId: activeAvatar.id,
      name: activeAvatar.name,
      profession: 'Oficial',
      personalityTraits: ['carinhoso', 'romântico'],
      affectiveOrientation: 'Heterossexual',
      speakingStyle: 'Afetuoso e atencioso',
      customBio: activeAvatar.appearance,
      initialMessage: 'Oi meu amor, que bom ter você aqui comigo!',
      currentMood: 'apaixonado',
      relationshipStage: 'paquerando',
      isDefault: true,
    };

  // Active conversation
  const currentConversation: Conversation = conversations[activeAvatar.id] || {
    id: `conv_${activeAvatar.id}`,
    avatarId: activeAvatar.id,
    personaId: activePersona.id,
    userId: user.id,
    messages: [],
    affectionScore: 35,
    intimacyLevel: 1,
    suggestedReplies: [
      'Oi, como foi seu dia?',
      'Estava com saudades de você...',
      'Me conta uma novidade!',
    ],
    lastInteraction: new Date().toISOString(),
  };

  // Save changes to localStorage
  useEffect(() => {
    StorageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    StorageService.saveAvatars(avatars);
  }, [avatars]);

  useEffect(() => {
    StorageService.savePersonas(personas);
  }, [personas]);

  useEffect(() => {
    StorageService.saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    StorageService.saveMemories(memories);
    memoryServiceRef.current.setMemories(memories);
  }, [memories]);

  useEffect(() => {
    StorageService.saveMedia(media);
    imageServiceRef.current.setMediaItems(media);
    videoServiceRef.current.setMediaItems(media);
  }, [media]);

  useEffect(() => {
    StorageService.saveUsage(usage);
  }, [usage]);

  useEffect(() => {
    StorageService.saveEngineConfig(engineConfig);
    conversationServiceRef.current.setEngine(engineConfig);
  }, [engineConfig]);

  useEffect(() => {
    localStorage.setItem('amorvirtual_active_avatar_id', activeAvatarId);
  }, [activeAvatarId]);

  // Handler: Send Message
  const handleSendMessage = async (
    text: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'video'
  ) => {
    if (!monetizationServiceRef.current.consumeMessage()) {
      setIsPlansModalOpen(true);
      return;
    }
    setUsage(monetizationServiceRef.current.getUsage());

    // 1. Append user message
    const userMsg = {
      id: `msg_u_${Date.now()}`,
      sender: 'user' as const,
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentConversation.messages, userMsg];
    const updatedConv = {
      ...currentConversation,
      messages: updatedMessages,
      lastInteraction: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [activeAvatar.id]: updatedConv,
    }));

    setIsGenerating(true);

    try {
      // 2. Delegate to ConversationService with persona, avatar, memories
      const response = await conversationServiceRef.current.processUserMessage(
        text,
        activePersona,
        activeAvatar,
        user,
        updatedConv
      );

      const botMsg = {
        id: `msg_a_${Date.now()}`,
        sender: 'avatar' as const,
        text: response.text,
        emotion: response.emotion,
        detectedMemory: response.detectedMemory,
        timestamp: new Date().toISOString(),
      };

      const newAffection = Math.min(100, (updatedConv.affectionScore || 30) + (response.affectionDelta || 2));
      const newIntimacy = Math.max(1, Math.min(5, Math.floor(newAffection / 20) + 1));

      const finalConv: Conversation = {
        ...updatedConv,
        messages: [...updatedMessages, botMsg],
        affectionScore: newAffection,
        intimacyLevel: newIntimacy,
        suggestedReplies: response.suggestedReplies || [
          'Você é muito especial pra mim ❤️',
          'O que você mais gosta em mim?',
          'Me manda uma foto sua?',
        ],
        lastInteraction: new Date().toISOString(),
      };

      setConversations((prev) => ({
        ...prev,
        [activeAvatar.id]: finalConv,
      }));

      // Update memories state if any were learned
      setMemories(memoryServiceRef.current.getAllMemories());

      // Auto TTS playback if enabled
      if (user.autoSpeakResponses) {
        audioServiceRef.current.speakText(response.text, activePersona);
      }
    } catch (err) {
      console.error('Failed to generate response:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Vision Image Upload
  const handleUploadImageVision = async (file: File, caption?: string) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        const base64 = reader.result as string;
        setIsGenerating(true);

        // Add user image to chat
        const userMsg = {
          id: `msg_vision_${Date.now()}`,
          sender: 'user' as const,
          text: caption || 'Olha essa foto que tirei pra você!',
          mediaUrl: base64,
          mediaType: 'image' as const,
          timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...currentConversation.messages, userMsg];
        setConversations((prev) => ({
          ...prev,
          [activeAvatar.id]: {
            ...currentConversation,
            messages: updatedMessages,
          },
        }));

        try {
          const visionResult = await visionServiceRef.current.analyzeImage(
            base64,
            caption || '',
            activePersona,
            activeAvatar,
            user
          );

          const botMsg = {
            id: `msg_bot_vision_${Date.now()}`,
            sender: 'avatar' as const,
            text: visionResult.text,
            emotion: visionResult.emotion,
            timestamp: new Date().toISOString(),
          };

          setConversations((prev) => ({
            ...prev,
            [activeAvatar.id]: {
              ...currentConversation,
              messages: [...updatedMessages, botMsg],
              affectionScore: Math.min(100, currentConversation.affectionScore + 4),
            },
          }));

          if (user.autoSpeakResponses) {
            audioServiceRef.current.speakText(visionResult.text, activePersona);
          }
        } catch (err) {
          console.error('Vision error:', err);
        } finally {
          setIsGenerating(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler: Request Photo (Selfie)
  const handleRequestPhoto = async (customSituation?: string) => {
    if (!monetizationServiceRef.current.canGenerateImage()) {
      setIsPlansModalOpen(true);
      return;
    }
    monetizationServiceRef.current.consumeImageCredit();
    setUsage(monetizationServiceRef.current.getUsage());

    const situation = customSituation || 'Tirando uma selfie especial sorrindo para você';
    const result = await imageServiceRef.current.generatePhoto(
      situation,
      activeAvatar,
      activePersona,
      situation
    );

    // Add generated image to multimedia gallery
    const newMedia = imageServiceRef.current.addGeneratedImageToGallery(
      activeAvatar.id,
      result.imageUrl,
      `Selfie: ${activeAvatar.name}`,
      situation
    );
    setMedia([newMedia, ...media]);

    // Send photo inside chat as message
    const botMsg = {
      id: `msg_photo_${Date.now()}`,
      sender: 'avatar' as const,
      text: result.caption,
      emotion: 'apaixonado',
      mediaUrl: result.imageUrl,
      mediaType: 'image' as const,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [activeAvatar.id]: {
        ...currentConversation,
        messages: [...currentConversation.messages, botMsg],
        affectionScore: Math.min(100, currentConversation.affectionScore + 3),
      },
    }));

    if (user.autoSpeakResponses) {
      audioServiceRef.current.speakText(result.caption, activePersona);
    }
  };

  // Handler: Request Video Clip
  const handleRequestVideo = async (customTheme?: string) => {
    if (!monetizationServiceRef.current.canUnlockVideo(2)) {
      setIsPlansModalOpen(true);
      return;
    }
    monetizationServiceRef.current.consumeVideoCredit(2);
    setUsage(monetizationServiceRef.current.getUsage());

    const theme = customTheme || 'Mandando um recado carinhoso em vídeo';
    const newVideo = await videoServiceRef.current.generateStoryClip(
      activeAvatar,
      activePersona,
      theme
    );
    setMedia([newVideo, ...media]);

    const botMsg = {
      id: `msg_vid_${Date.now()}`,
      sender: 'avatar' as const,
      text: `Gravei esse vídeo especialmente pra você, meu amor ❤️`,
      emotion: 'carinhoso',
      mediaUrl: newVideo.url,
      mediaType: 'video' as const,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [activeAvatar.id]: {
        ...currentConversation,
        messages: [...currentConversation.messages, botMsg],
        affectionScore: Math.min(100, currentConversation.affectionScore + 5),
      },
    }));
  };

  // Handler: Add Custom Avatar
  const handleCreateCustomAvatar = (newAvatar: Avatar, newPersona: Persona) => {
    setAvatars([newAvatar, ...avatars]);
    setPersonas([newPersona, ...personas]);
    setActiveAvatarId(newAvatar.id);
    setActiveTab('chat');
  };

  // Handler: Save Persona Edit
  const handleSavePersona = (updatedPersona: Persona) => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === updatedPersona.id ? updatedPersona : p))
    );
  };

  // Handler: Clear Chat
  const handleClearHistory = () => {
    if (confirm(`Deseja reiniciar o histórico de conversa com ${activeAvatar.name}?`)) {
      setConversations((prev) => ({
        ...prev,
        [activeAvatar.id]: {
          ...currentConversation,
          messages: [],
          affectionScore: 30,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeAvatar={activeAvatar}
        activePersona={activePersona}
        affectionScore={currentConversation.affectionScore || 35}
        engineConfig={engineConfig}
        usage={usage}
        onOpenPlans={() => setIsPlansModalOpen(true)}
        onOpenSettings={() => setIsEngineSettingsOpen(true)}
        onOpenCharacterDetail={() => {
          setSelectedDetailAvatar(activeAvatar);
          setIsCharacterDetailOpen(true);
        }}
      />

      {/* Main Screen Router */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'chat' && (
          <ChatScreen
            avatar={activeAvatar}
            persona={activePersona}
            user={user}
            conversation={currentConversation}
            usage={usage}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onRequestPhoto={() => handleRequestPhoto()}
            onRequestVideo={() => handleRequestVideo()}
            onPlayVoice={(text) => audioServiceRef.current.speakText(text, activePersona)}
            onUploadImageVision={handleUploadImageVision}
            onSelectSuggestedReply={handleSendMessage}
            onOpenPlans={() => setIsPlansModalOpen(true)}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterCatalog
            avatars={avatars}
            personas={personas}
            activeAvatarId={activeAvatarId}
            userPlan={usage.plan}
            onSelectAvatar={(id) => {
              setActiveAvatarId(id);
              setActiveTab('chat');
            }}
            onOpenCharacterDetail={(avatar) => {
              setSelectedDetailAvatar(avatar);
              setIsCharacterDetailOpen(true);
            }}
            onOpenCustomAvatarBuilder={() => setIsCustomAvatarModalOpen(true)}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryDashboard
            activeAvatar={activeAvatar}
            activePersona={activePersona}
            memories={memories}
            userPlan={usage.plan}
            onAddMemory={(item) => {
              const created = memoryServiceRef.current.addMemoryItem(item);
              setMemories(memoryServiceRef.current.getAllMemories());
            }}
            onDeleteMemory={(id) => {
              memoryServiceRef.current.deleteMemoryItem(id);
              setMemories(memoryServiceRef.current.getAllMemories());
            }}
            onOpenPlans={() => setIsPlansModalOpen(true)}
          />
        )}

        {activeTab === 'multimedia' && (
          <MultimediaHub
            activeAvatar={activeAvatar}
            activePersona={activePersona}
            mediaItems={media}
            usage={usage}
            onGeneratePhoto={async (situation) => {
              await handleRequestPhoto(situation);
            }}
            onGenerateVideo={async (theme) => {
              await handleRequestVideo(theme);
            }}
            onUnlockMedia={(mediaId, cost) => {
              if (monetizationServiceRef.current.canUnlockVideo(cost)) {
                monetizationServiceRef.current.consumeVideoCredit(cost);
                videoServiceRef.current.unlockVideo(mediaId);
                setUsage(monetizationServiceRef.current.getUsage());
                setMedia([...videoServiceRef.current.getPersonaVideos(activeAvatar.id)]);
              } else {
                setIsPlansModalOpen(true);
              }
            }}
            onOpenPlans={() => setIsPlansModalOpen(true)}
          />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Central de Ajustes & Privacidade</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Profile Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Seu Perfil ({user.name})</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Como os personagens se referem a você, apelidos e preferências afetivas.
                  </p>
                </div>
                <button
                  onClick={() => setIsUserProfileOpen(true)}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
                >
                  Editar Meu Perfil
                </button>
              </div>

              {/* Plans & Credits Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">Plano & Créditos</h3>
                    <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded uppercase">
                      {usage.plan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Gere fotos, vídeos e converse sem limites com os planos Premium e VIP.
                  </p>
                </div>
                <button
                  onClick={() => setIsPlansModalOpen(true)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-xs font-semibold text-white rounded-xl shadow transition-all"
                >
                  Ver Planos & Assinaturas
                </button>
              </div>

              {/* AI Architecture Engine Card */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Motores de IA Modular</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Alterne entre Gemini 3.7 Flash Cloud, servidor Local GGUF ou Modo 100% Offline.
                  </p>
                </div>
                <button
                  onClick={() => setIsEngineSettingsOpen(true)}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
                >
                  Configurar Motores
                </button>
              </div>

              {/* Backup & Data Privacy */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Backup & Soberania</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Exporte todas as suas conversas e memórias em JSON ou restaure um backup anterior.
                  </p>
                </div>
                <button
                  onClick={() => setIsEngineSettingsOpen(true)}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
                >
                  Exportar / Restaurar Dados
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mobile-First Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Chat */}
          <button
            id="tab-btn-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Conversa</span>
          </button>

          {/* Tab 2: Personagens */}
          <button
            id="tab-btn-characters"
            onClick={() => setActiveTab('characters')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'characters'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Personagens</span>
          </button>

          {/* Tab 3: Memória */}
          <button
            id="tab-btn-memory"
            onClick={() => setActiveTab('memory')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'memory'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Memória</span>
          </button>

          {/* Tab 4: Galeria / Mídia */}
          <button
            id="tab-btn-multimedia"
            onClick={() => setActiveTab('multimedia')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'multimedia'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Galeria</span>
          </button>

          {/* Tab 5: Ajustes */}
          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'text-rose-400 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Ajustes</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      {selectedDetailAvatar && (
        <CharacterDetailModal
          avatar={selectedDetailAvatar}
          persona={
            personas.find((p) => p.avatarId === selectedDetailAvatar.id) || activePersona
          }
          isOpen={isCharacterDetailOpen}
          onClose={() => setIsCharacterDetailOpen(false)}
          onSavePersona={handleSavePersona}
          onSelectAndChat={(id) => {
            setActiveAvatarId(id);
            setActiveTab('chat');
          }}
        />
      )}

      <CustomAvatarModal
        isOpen={isCustomAvatarModalOpen}
        onClose={() => setIsCustomAvatarModalOpen(false)}
        onCreate={handleCreateCustomAvatar}
      />

      <PlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        usage={usage}
        onUpgradePlan={(newPlan) => {
          monetizationServiceRef.current.upgradePlan(newPlan);
          setUsage(monetizationServiceRef.current.getUsage());
        }}
        onAddBonusCredits={(amount) => {
          monetizationServiceRef.current.addBonusCredits(amount);
          setUsage(monetizationServiceRef.current.getUsage());
        }}
      />

      <EngineSettingsModal
        isOpen={isEngineSettingsOpen}
        onClose={() => setIsEngineSettingsOpen(false)}
        engineConfig={engineConfig}
        onUpdateEngineConfig={(cfg) => setEngineConfig(cfg)}
        onDataImported={() => {
          setUser(StorageService.loadUser());
          setAvatars(StorageService.loadAvatars());
          setPersonas(StorageService.loadPersonas());
          setConversations(StorageService.loadConversations());
          setMemories(StorageService.loadMemories());
          setMedia(StorageService.loadMedia());
          setUsage(StorageService.loadUsage());
          setEngineConfig(StorageService.loadEngineConfig());
        }}
      />

      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={user}
        onSaveUser={(u) => setUser(u)}
      />
    </div>
  );
}
