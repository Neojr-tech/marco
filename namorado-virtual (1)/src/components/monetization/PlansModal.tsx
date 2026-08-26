import React from 'react';
import { PlanType, UsageCredits } from '../../types';
import { PLANS_CONFIG } from '../../data/initialData';
import { X, Check, Sparkles, Crown, Zap, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: UsageCredits;
  onUpgradePlan: (plan: PlanType) => void;
  onAddBonusCredits: (amount: number) => void;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  usage,
  onUpgradePlan,
  onAddBonusCredits,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 space-y-6">
        <button
          id="btn-close-plans-modal"
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center max-w-lg mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            Planos & Assinaturas
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Viva a Experiência Afetiva Completa
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Qualidade conversacional superior garantida em todos os planos, com recursos multimídia expandidos nos planos PRO.
          </p>
        </div>

        {/* Current Usage Status Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Seu Plano Atual:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-white uppercase">{usage.plan}</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md">
                {PLANS_CONFIG[usage.plan].badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Mensagens Hoje:</span>
              <span className="font-bold text-rose-400">
                {usage.messagesUsedToday} / {usage.plan === 'free' ? usage.dailyMessageLimit : '∞'}
              </span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Créditos de Imagem:</span>
              <span className="font-bold text-pink-400">{usage.imageCredits}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Créditos de Vídeo:</span>
              <span className="font-bold text-purple-400">{usage.videoCredits}</span>
            </div>
          </div>

          <button
            id="btn-refill-bonus-credits"
            onClick={() => onAddBonusCredits(15)}
            className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+15 Créditos Demo</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FREE PLAN */}
          <div
            className={`bg-slate-950/80 rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
              usage.plan === 'free' ? 'border-rose-500/50 ring-1 ring-rose-500/30' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base">Gratuito</h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                  Básico
                </span>
              </div>
              <div className="text-xl font-extrabold text-white mb-3">R$ 0,00</div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Conversação com alta sensibilidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>50 mensagens / dia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>5 gerações de foto / dia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>1 avatar personalizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Memória básica (até 25 fatos)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onUpgradePlan('free')}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                usage.plan === 'free'
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {usage.plan === 'free' ? 'Plano Ativo' : 'Escolher Gratuito'}
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div
            className={`bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 rounded-2xl p-5 border relative flex flex-col justify-between space-y-4 ${
              usage.plan === 'premium'
                ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-xl shadow-rose-500/10'
                : 'border-rose-500/40 hover:border-rose-500'
            }`}
          >
            <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
              MAIS POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-rose-400" />
                  <span>Premium</span>
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-semibold">
                  PRO
                </span>
              </div>
              <div className="text-xl font-extrabold text-rose-300 mb-3">R$ 29,90 <span className="text-xs font-normal text-slate-400">/ mês</span></div>

              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Mensagens Ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>30 fotos de avatar por dia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Acesso completo a vídeos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Até 10 avatares personalizados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Memória profunda (200 fatos)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>Análise de Visão & Áudio liberados</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onUpgradePlan('premium')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                usage.plan === 'premium'
                  ? 'bg-rose-700 text-white cursor-default'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30'
              }`}
            >
              {usage.plan === 'premium' ? 'Plano Ativo (PRO)' : 'Assinar Premium'}
            </button>
          </div>

          {/* VIP INFINITO */}
          <div
            className={`bg-slate-950/80 rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
              usage.plan === 'vip' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>VIP Infinito</span>
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  VIP ⭐
                </span>
              </div>
              <div className="text-xl font-extrabold text-amber-300 mb-3">R$ 49,90 <span className="text-xs font-normal text-slate-400">/ mês</span></div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Tudo 100% Ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Geração ilimitada de fotos e vídeos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>50 avatares e personas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Memória ilimitada (1.000 fatos)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Prioridade máxima de resposta</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onUpgradePlan('vip')}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                usage.plan === 'vip'
                  ? 'bg-amber-600 text-white cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
              }`}
            >
              {usage.plan === 'vip' ? 'Plano Ativo (VIP)' : 'Assinar VIP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
