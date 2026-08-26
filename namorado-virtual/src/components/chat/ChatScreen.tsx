import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Conversation,
  Message,
  Persona,
  UsageCredits,
  UserProfile,
} from '../../types';
import { MessageBubble } from './MessageBubble';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Smile,
  RefreshCw,
  Video,
} from 'lucide-react';

interface ChatScreenProps {
  avatar: Avatar;
  persona: Persona;
  user: UserProfile;
  conversation: Conversation;
  usage: UsageCredits;
  isGenerating: boolean;
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video') => void;
  onRequestPhoto: () => void;
  onRequestVideo: () => void;
  onPlayVoice: (text: string) => void;
  onUploadImageVision: (file: File, caption?: string) => void;
  onSelectSuggestedReply: (reply: string) => void;
  onOpenPlans: () => void;
  onClearHistory: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  avatar,
  persona,
  user,
  conversation,
  usage,
  isGenerating,
  onSendMessage,
  onRequestPhoto,
  onRequestVideo,
  onPlayVoice,
  onUploadImageVision,
  onSelectSuggestedReply,
  onOpenPlans,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [autoVoice, setAutoVoice] = useState(user.autoSpeakResponses);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isGenerating]);

  // Speech Recognition handler
  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        alert('Reconhecimento de voz não está disponível neste navegador.');
        return;
      }
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${text}` : text));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const caption = prompt('Deseja adicionar uma legenda ou pergunta para a foto?', 'O que você achou?');
      onUploadImageVision(file, caption || undefined);
      setShowAttachMenu(false);
    }
  };

  // Quick Action Buttons
  const quickActions = [
    { label: '📸 Pedir selfie', onClick: onRequestPhoto, icon: <Camera className="w-3.5 h-3.5" /> },
    { label: '🎬 Ver vídeo', onClick: onRequestVideo, icon: <Video className="w-3.5 h-3.5" /> },
    { label: '❤️ Como tá seu dia?', onClick: () => onSendMessage('Oi lindo, como tá sendo seu dia hoje?'), icon: <Smile className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-4xl mx-auto bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Affection & Intimacy Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0 animate-pulse" />
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(5, conversation.affectionScore)}%` }}
            ></div>
          </div>
          <span className="font-semibold text-rose-300 text-[11px] whitespace-nowrap">
            {conversation.affectionScore}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="hidden sm:inline text-[11px]">Nível {conversation.intimacyLevel}:</span>
          <span className="font-medium text-slate-200 capitalize text-[11px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            {persona.relationshipStage}
          </span>
          <button
            id="btn-toggle-autovoice"
            onClick={() => setAutoVoice(!autoVoice)}
            className={`p-1 rounded-md transition-colors ${autoVoice ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            title={autoVoice ? 'Voz automática ativa' : 'Voz automática desativada'}
          >
            {autoVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scroll-smooth">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-rose-500/60 shadow-lg">
              <img
                src={avatar.baseImage}
                alt={avatar.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">{avatar.name}</h2>
            <p className="text-xs text-rose-300 mb-3">{persona.profession} • {persona.personalityTraits.join(', ')}</p>
            <p className="text-xs max-w-md bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-slate-300 italic mb-4">
              "{persona.initialMessage}"
            </p>
            <button
              id="btn-start-first-msg"
              onClick={() => onSendMessage(persona.initialMessage)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Responder {avatar.name}
            </button>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              avatar={avatar}
              persona={persona}
              onPlayAudio={onPlayVoice}
              onImageClick={(url) => setSelectedPhotoPreview(url)}
              onVideoClick={(url) => setSelectedVideoPreview(url)}
            />
          ))
        )}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 animate-pulse">
            <img
              src={avatar.baseImage}
              alt={avatar.name}
              className="w-6 h-6 rounded-full object-cover border border-rose-500/50"
              referrerPolicy="no-referrer"
            />
            <div className="bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-300 ml-1">{avatar.name} está digitando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies Carousel */}
      {conversation.suggestedReplies && conversation.suggestedReplies.length > 0 && !isGenerating && (
        <div className="px-3 py-1.5 bg-slate-900/50 border-t border-slate-800/60 overflow-x-auto flex gap-1.5 scrollbar-none">
          {conversation.suggestedReplies.map((reply, i) => (
            <button
              key={i}
              id={`btn-suggested-reply-${i}`}
              onClick={() => onSelectSuggestedReply(reply)}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1 rounded-full transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>{reply}</span>
            </button>
          ))}
        </div>
      )}

      {/* Action shortcuts bar */}
      <div className="px-3 py-1 bg-slate-900/40 border-t border-slate-800/40 flex items-center justify-between gap-1 overflow-x-auto">
        <div className="flex items-center gap-1">
          {quickActions.map((action, i) => (
            <button
              key={i}
              id={`btn-quick-action-${i}`}
              onClick={action.onClick}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1 whitespace-nowrap"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <button
          id="btn-clear-chat"
          onClick={onClearHistory}
          title="Reiniciar histórico de conversa"
          className="text-[10px] text-slate-500 hover:text-slate-300 p-1 flex items-center gap-1 ml-auto"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        {/* Hidden File Input for Vision Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Attach photo / camera button */}
        <button
          id="btn-attach-vision"
          onClick={() => fileInputRef.current?.click()}
          title="Enviar foto para análise (Visão)"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            id="input-chat-message"
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Ouvindo sua voz...' : `Converse com ${avatar.name}...`}
            className={`w-full bg-slate-800/90 border ${
              isRecording ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-700 focus:border-rose-500'
            } text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-all`}
          />
        </div>

        {/* Microphone STT Button */}
        <button
          id="btn-voice-record"
          onClick={handleMicToggle}
          title={isRecording ? 'Parar gravação' : 'Gravar áudio / falar'}
          className={`p-2 rounded-xl transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/50'
              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
          }`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          id="btn-send-message"
          onClick={handleSend}
          disabled={!inputText.trim() || isGenerating}
          title="Enviar mensagem"
          className={`p-2.5 rounded-xl transition-all ${
            inputText.trim() && !isGenerating
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30 hover:opacity-90 active:scale-95'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {selectedPhotoPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-w-xl max-h-[90vh]">
            <img
              src={selectedPhotoPreview}
              alt="Foto ampliada"
              className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideoPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideoPreview(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <video
              src={selectedVideoPreview}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl max-h-[80vh] bg-black"
            />
            <button
              onClick={() => setSelectedVideoPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm bg-slate-800 px-3 py-1 rounded-full"
            >
              Fechar ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
