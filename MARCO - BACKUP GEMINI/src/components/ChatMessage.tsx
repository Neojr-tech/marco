import React, { useState } from "react";
import { Message } from "../types";
import { MARCO_PROFILE } from "../data/marcoProfile";
import {
  Volume2,
  VolumeX,
  Loader2,
  Play,
  CheckCheck,
  Sparkles,
  Download,
  Eye,
  Video,
  Image as ImageIcon,
} from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onPlayAudio: (msg: Message) => void;
  isPlayingAudio: boolean;
  onExpandImage?: (url: string) => void;
  onRegenerateImage?: (prompt: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onPlayAudio,
  isPlayingAudio,
  onExpandImage,
}) => {
  const isUser = message.role === "user";
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Clean text by removing raw tags for display
  const cleanedText = message.content
    .replace(/\[GERAR_IMAGEM:[^\]]+\]/g, "")
    .replace(/\[GERAR_VIDEO:[^\]]+\]/g, "")
    .trim();

  return (
    <div
      className={`flex flex-col mb-4 ${
        isUser ? "items-end" : "items-start"
      } animate-fade-in`}
    >
      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
        {!isUser && (
          <img
            src={MARCO_PROFILE.avatarUrl}
            alt={MARCO_PROFILE.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-500/40 mb-1 flex-shrink-0 shadow-sm"
          />
        )}

        <div
          className={`relative group p-3.5 rounded-2xl shadow-md transition-all ${
            isUser
              ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-br-none"
              : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-none"
          }`}
        >
          {/* Audio voice playback button for Marco's messages */}
          {!isUser && cleanedText && (
            <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-700/50">
              <span className="text-[11px] font-medium text-amber-400/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Marco (Salvador)
              </span>

              <button
                onClick={() => onPlayAudio(message)}
                disabled={message.isAudioLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              >
                {message.isAudioLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Gerando áudio...</span>
                  </>
                ) : isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>Pausar voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Ouvir voz do Marco 🎙️</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Text Content */}
          {cleanedText && (
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
              {cleanedText}
            </p>
          )}

          {/* Generated Image Card */}
          {message.imagePrompt && (
            <div className="mt-3 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between text-xs text-amber-400 mb-2 px-1">
                <span className="flex items-center gap-1 font-semibold">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Foto enviada por Marco 📸
                </span>
              </div>

              {message.generatedImage ? (
                <div className="relative group/img rounded-lg overflow-hidden bg-slate-950">
                  <img
                    src={message.generatedImage}
                    alt="Foto de Marco"
                    referrerPolicy="no-referrer"
                    className="w-full max-h-72 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => onExpandImage && onExpandImage(message.generatedImage!)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => onExpandImage && onExpandImage(message.generatedImage!)}
                      className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm"
                      title="Expandir foto"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={message.generatedImage}
                      download="marco_foto.png"
                      className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm"
                      title="Baixar foto"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-slate-950/60 rounded-lg border border-dashed border-amber-500/30 text-amber-400/80 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <span className="text-xs font-medium">
                    Marco está tirando a foto para você... 📸✨
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Video Preview Card */}
          {message.videoPrompt && (
            <div className="mt-3 rounded-xl overflow-hidden border border-rose-500/40 bg-slate-900/90 p-2 shadow-lg">
              <div className="flex items-center justify-between text-xs text-rose-400 mb-2 px-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  Vídeo exclusivo do Marco 🎥 (5s)
                </span>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800 group/vid">
                {/* Background image preview for video */}
                <img
                  src={MARCO_PROFILE.bedroomPhotoUrl}
                  alt="Marco Vídeo"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isVideoPlaying ? "scale-110 brightness-110 blur-[1px]" : "brightness-90"
                  }`}
                />

                {!isVideoPlaying ? (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute p-4 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white shadow-xl backdrop-blur-md transform hover:scale-110 transition-all flex items-center justify-center gap-2 group-hover/vid:scale-110"
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </button>
                ) : (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mb-3" />
                    <p className="text-xs text-white font-medium animate-pulse">
                      Exibindo vídeo do Marco... 💖
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 italic">
                      "{message.videoPrompt}"
                    </p>
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="mt-3 text-[11px] px-3 py-1 bg-slate-800/80 hover:bg-slate-800 text-rose-300 rounded-full border border-rose-500/30"
                    >
                      Pausar vídeo
                    </button>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  HD 1080p • Salvador
                </div>
              </div>
            </div>
          )}

          {/* Message Footer / Timestamp */}
          <div
            className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
              isUser ? "text-amber-100/80" : "text-slate-400"
            }`}
          >
            <span>{message.timestamp}</span>
            {isUser && <CheckCheck className="w-3 h-3 text-amber-200" />}
          </div>
        </div>
      </div>
    </div>
  );
};
