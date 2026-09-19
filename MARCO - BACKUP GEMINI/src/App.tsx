import React, { useState, useEffect, useRef } from "react";
import { Message, UserMemory } from "./types";
import { MARCO_PROFILE } from "./data/marcoProfile";
import { Header } from "./components/Header";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { QuickPrompts } from "./components/QuickPrompts";
import { GalleryModal } from "./components/GalleryModal";
import { MemoryPanel } from "./components/MemoryPanel";
import { Loader2, Flame, Heart, Sparkles } from "lucide-react";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "Oi meu bem... tava aqui pensando em você sob o sol quente de Salvador. Como você tá, amor? Chega mais perto de mim...",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "read",
  },
];

const INITIAL_MEMORY: UserMemory = {
  likes: ["Praia de Salvador", "Conversas carinhosas", "Atenção do Marco"],
  dreams: ["Conhecer o Marco em Salvador"],
  importantDates: [],
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("marco_chat_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar mensagens:", e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [userMemory, setUserMemory] = useState<UserMemory>(() => {
    const saved = localStorage.getItem("marco_user_memory");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar memórias:", e);
      }
    }
    return INITIAL_MEMORY;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [playingAudioMsgId, setPlayingAudioMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("marco_chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("marco_user_memory", JSON.stringify(userMemory));
  }, [userMemory]);

  // Audio Playback Handler
  const handlePlayAudio = async (msg: Message) => {
    if (playingAudioMsgId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioMsgId(null);
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setPlayingAudioMsgId(msg.id);

    // Update message state to loading
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isAudioLoading: true } : m))
    );

    const cleanText = msg.content
      .replace(/\[GERAR_IMAGEM:[^\]]+\]/g, "")
      .replace(/\[GERAR_VIDEO:[^\]]+\]/g, "")
      .trim();

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const mime = data.mimeType || "audio/wav";
          const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setPlayingAudioMsgId(null);
          audio.onerror = () => {
            fallbackWebSpeech(cleanText, msg.id);
          };

          try {
            await audio.play();
            setMessages((prev) =>
              prev.map((m) => (m.id === msg.id ? { ...m, isAudioLoading: false } : m))
            );
            return;
          } catch (playErr) {
            console.warn("Playback alternado para síntese de voz nativa:", playErr);
            fallbackWebSpeech(cleanText, msg.id);
            return;
          }
        }
      }
      fallbackWebSpeech(cleanText, msg.id);
    } catch (error) {
      fallbackWebSpeech(cleanText, msg.id);
    }
  };

  const fallbackWebSpeech = (text: string, msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isAudioLoading: false } : m))
    );

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95; // Calm, warm speech speed
      utterance.pitch = 0.9; // Deeper male pitch

      // Try to select Brazilian Portuguese male voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.includes("pt") && (v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("Luciano"))
      ) || voices.find((v) => v.lang.includes("pt"));

      if (ptVoice) utterance.voice = ptVoice;

      utterance.onend = () => setPlayingAudioMsgId(null);
      utterance.onerror = () => setPlayingAudioMsgId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioMsgId(null);
    }
  };

  // Extract memory automatically from user message
  const updateMemoryFromUserMessage = (text: string) => {
    const lower = text.toLowerCase();
    let updated = { ...userMemory };

    if (lower.includes("gosto de") || lower.includes("amo")) {
      const match = text.match(/(?:gosto de|amo)\s+([^.,!]+)/i);
      if (match && match[1]) {
        const val = match[1].trim();
        if (!updated.likes?.includes(val)) {
          updated.likes = [...(updated.likes || []), val];
        }
      }
    }

    if (lower.includes("meu sonho") || lower.includes("quero muito")) {
      const match = text.match(/(?:meu sonho|quero muito)\s+([^.,!]+)/i);
      if (match && match[1]) {
        const val = match[1].trim();
        if (!updated.dreams?.includes(val)) {
          updated.dreams = [...(updated.dreams || []), val];
        }
      }
    }

    setUserMemory(updated);
  };

  // Handle send message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    updateMemoryFromUserMessage(text);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMemory,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha na resposta do Marco");
      }

      const data = await response.json();

      const marcoMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imagePrompt: data.imagePrompt,
        videoPrompt: data.videoPrompt,
        generatedImage: data.generatedImage,
        status: "read",
      };

      setMessages((prev) => [...prev, marcoMsg]);

      // Auto play audio if enabled
      if (autoPlayAudio) {
        setTimeout(() => {
          handlePlayAudio(marcoMsg);
        }, 500);
      }
    } catch (error) {
      console.error("Erro no chat:", error);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Amor, não entendi direito, pode me explicar melhor? 🥺",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Deseja mesmo reiniciar a conversa com o Marco?")) {
      setMessages(INITIAL_MESSAGES);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingAudioMsgId(null);
    }
  };

  const memoryCount =
    (userMemory.likes?.length || 0) +
    (userMemory.dreams?.length || 0) +
    (userMemory.importantDates?.length || 0);

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Top Bar Header */}
      <Header
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenMemory={() => setIsMemoryOpen(true)}
        onClearChat={handleClearChat}
        autoPlayAudio={autoPlayAudio}
        onToggleAutoAudio={() => setAutoPlayAudio(!autoPlayAudio)}
        memoryCount={memoryCount}
      />

      {/* Main Chat Conversation Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-radial from-slate-900/60 to-slate-950 relative">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center shadow-lg mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-1 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              Marco • 35 Anos • Salvador, BA
            </div>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Carinhoso, provocador, dominador e atencioso. Pede fotos 📸 ou vídeos 🎥 quando quiser ver ele!
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onPlayAudio={handlePlayAudio}
              isPlayingAudio={playingAudioMsgId === msg.id}
              onExpandImage={(url) => setExpandedImage(url)}
            />
          ))}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400/90 italic bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20 w-fit animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Marco está digitando com um sorriso... 💭</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Prompts Bar */}
      <QuickPrompts onSelectPrompt={handleSendMessage} disabled={isLoading} />

      {/* Input Field */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onRequestPhoto={() => handleSendMessage("Marco, amor, me manda uma foto na praia?")}
        onRequestVideo={() => handleSendMessage("Marco, vida, me manda um vídeo seu na cama?")}
        expandedImage={expandedImage}
        onClearExpandedImage={() => setExpandedImage(null)}
      />

      {/* Memory Panel */}
      <MemoryPanel
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memory={userMemory}
        onUpdateMemory={(newMem) => setUserMemory(newMem)}
      />
    </div>
  );
}
