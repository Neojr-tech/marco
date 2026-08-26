import React from 'react';
import { Avatar, EngineConfig, Persona, UsageCredits } from '../../types';
import { Cpu, Heart, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  activeAvatar: Avatar;
  activePersona: Persona;
  affectionScore: number;
  engineConfig: EngineConfig;
  usage: UsageCredits;
  onOpenPlans: () => void;
  onOpenSettings: () => void;
  onOpenCharacterDetail: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeAvatar,
  activePersona,
  affectionScore,
  engineConfig,
  usage,
  onOpenPlans,
  onOpenSettings,
  onOpenCharacterDetail,
}) => {
  const getEngineBadge = () => {
    if (engineConfig.isOfflineMode) {
      return {
        label: '100% Offline',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: <ShieldCheck className="w-3 h-3" />,
      };
    }
    if (engineConfig.provider === 'gemini') {
      return {
        label: 'Gemini 3.7 Flash',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        icon: <Sparkles className="w-3 h-3 text-blue-400" />,
      };
    }
    if (engineConfig.provider === 'local_gguf') {
      return {
        label: 'Local GGUF',
        color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        icon: <Cpu className="w-3 h-3 text-purple-400" />,
      };
    }
    return {
      label: 'Motor Simulado',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <Zap className="w-3 h-3" />,
    };
  };

  const badge = getEngineBadge();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Active Character Quick Info */}
        <button
          id="btn-header-character"
          onClick={onOpenCharacterDetail}
          className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity flex-1 min-w-0"
        >
          <div className="relative flex-shrink-0">
            <img
              src={activeAvatar.baseImage}
              alt={activeAvatar.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/70 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white text-sm truncate">{activeAvatar.name}</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium whitespace-nowrap">
                {activePersona.profession}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-rose-400">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span className="font-medium">{affectionScore}%</span>
              </span>
              <span>•</span>
              <span className="truncate capitalize text-slate-300">{activePersona.relationshipStage}</span>
            </div>
          </div>
        </button>

        {/* Right Tools: Engine Pill & Credits */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="btn-header-engine"
            onClick={onOpenSettings}
            title="Configurações de IA e Privacidade"
            className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg border transition-colors ${badge.color}`}
          >
            {badge.icon}
            <span className="hidden sm:inline font-medium">{badge.label}</span>
          </button>

          <button
            id="btn-header-credits"
            onClick={onOpenPlans}
            title="Gerenciar Plano e Créditos"
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-200 hover:from-amber-500/30 hover:to-rose-500/30 transition-all"
          >
            <span className="font-bold uppercase text-[10px] bg-amber-500/30 text-amber-300 px-1 py-0.2 rounded">
              {usage.plan}
            </span>
            <span className="font-semibold text-amber-300 text-[11px]">
              {usage.plan === 'free' ? `${Math.max(0, usage.dailyMessageLimit - usage.messagesUsedToday)} msgs` : '∞'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
