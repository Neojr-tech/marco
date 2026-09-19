import React from "react";
import { MARCO_PROFILE } from "../data/marcoProfile";
import { UserMemory } from "../types";
import {
  Sun,
  Image as ImageIcon,
  Heart,
  Volume2,
  VolumeX,
  Trash2,
  MapPin,
  Flame,
} from "lucide-react";

interface HeaderProps {
  onOpenGallery: () => void;
  onOpenMemory: () => void;
  onClearChat: () => void;
  autoPlayAudio: boolean;
  onToggleAutoAudio: () => void;
  memoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGallery,
  onOpenMemory,
  onClearChat,
  autoPlayAudio,
  onToggleAutoAudio,
  memoryCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Marco Avatar & Status */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenGallery}>
          <div className="relative">
            <img
              src={MARCO_PROFILE.avatarUrl}
              alt={MARCO_PROFILE.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/50 shadow-md hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-slate-100 font-bold text-lg leading-tight flex items-center gap-1">
                {MARCO_PROFILE.name}, {MARCO_PROFILE.age}
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                <MapPin className="w-3 h-3" />
                {MARCO_PROFILE.location} - BA
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Sun className="w-3 h-3 text-amber-400 animate-spin-slow" />
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Audio */}
          <button
            onClick={onToggleAutoAudio}
            title={autoPlayAudio ? "Voz automática ligada" : "Voz automática desligada"}
            className={`p-2 rounded-full transition-colors ${
              autoPlayAudio
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {autoPlayAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Gallery Button */}
          <button
            onClick={onOpenGallery}
            title="Galeria de Fotos do Marco"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors relative"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Memory Button */}
          <button
            onClick={onOpenMemory}
            title="Memórias do Nosso Amor"
            className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors relative"
          >
            <Heart className="w-4 h-4 fill-rose-500/30" />
            {memoryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {memoryCount}
              </span>
            )}
          </button>

          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            title="Limpar Conversa"
            className="p-2 rounded-full bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
