import React from 'react';
import { Avatar, Message, Persona } from '../../types';
import { Heart, Volume2, Sparkles, CheckCheck, Play } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  avatar: Avatar;
  persona: Persona;
  onPlayAudio?: (text: string) => void;
  onImageClick?: (url: string) => void;
  onVideoClick?: (url: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  avatar,
  persona: _persona,
  onPlayAudio,
  onImageClick,
  onVideoClick,
}) => {
  const isUser = message.sender === 'user';

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getEmotionBadge = (emotion?: string) => {
    if (!emotion) return null;
    const map: Record<string, { label: string; color: string; icon: string }> = {
      apaixonado: { label: 'Apaixonado', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: '❤️' },
      carinhoso: { label: 'Carinhoso', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30', icon: '🥰' },
      sedutor: { label: 'Ousado', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '🔥' },
      brincalhao: { label: 'Brincalhão', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '😉' },
      preocupado: { label: 'Cuidando de você', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '🫂' },
      alegre: { label: 'Animado', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '✨' },
    };
    const badge = map[emotion] || { label: emotion, color: 'bg-slate-700 text-slate-300 border-slate-600', icon: '💬' };

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${badge.color} mb-1 font-medium`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-2`}>
      <div className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <img
            src={avatar.baseImage}
            alt={avatar.name}
            className="w-8 h-8 rounded-full object-cover border border-rose-500/50 flex-shrink-0 self-end mb-1"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="flex flex-col">
          {!isUser && message.emotion && getEmotionBadge(message.emotion)}

          <div
            className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
              isUser
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-xs'
                : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-xs'
            }`}
          >
            {/* Media Attachment (Photo) */}
            {message.mediaUrl && message.mediaType === 'image' && (
              <div className="mb-2 rounded-xl overflow-hidden cursor-pointer group relative">
                <img
                  src={message.mediaUrl}
                  alt="Anexo de mídia"
                  className="w-full max-h-60 object-cover rounded-xl group-hover:opacity-95 transition-opacity"
                  onClick={() => onImageClick && onImageClick(message.mediaUrl!)}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-2 bg-black/60 text-[10px] px-2 py-0.5 rounded text-white backdrop-blur-xs">
                  Toque para ampliar
                </span>
              </div>
            )}

            {/* Media Attachment (Video) */}
            {message.mediaUrl && message.mediaType === 'video' && (
              <div
                className="mb-2 rounded-xl overflow-hidden cursor-pointer relative bg-slate-900 aspect-video flex items-center justify-center group"
                onClick={() => onVideoClick && onVideoClick(message.mediaUrl!)}
              >
                <video
                  src={message.mediaUrl}
                  className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Main Text Content */}
            <p className="whitespace-pre-wrap leading-relaxed select-text">{message.text}</p>

            {/* Detected Memory Badge */}
            {message.detectedMemory && (
              <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] text-amber-300/90">
                <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="italic">Memória guardada: {message.detectedMemory}</span>
              </div>
            )}

            {/* Footer: Audio listen button & Time */}
            <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] opacity-75">
              {!isUser && onPlayAudio && (
                <button
                  id={`btn-play-audio-${message.id}`}
                  onClick={() => onPlayAudio(message.text)}
                  className="flex items-center gap-1 text-rose-300 hover:text-rose-200 transition-colors py-0.5"
                  title="Ouvir mensagem por voz"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Ouvir</span>
                </button>
              )}

              <div className="flex items-center gap-1 ml-auto">
                <span>{formatTime(message.timestamp)}</span>
                {isUser && <CheckCheck className="w-3.5 h-3.5 text-rose-200" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
