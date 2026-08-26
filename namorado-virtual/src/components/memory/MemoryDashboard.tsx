import React, { useState } from 'react';
import { Avatar, MemoryCategory, MemoryItem, Persona, PlanType } from '../../types';
import {
  Brain,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Heart,
  Calendar,
  Lock,
  Smile,
  Coffee,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';

interface MemoryDashboardProps {
  activeAvatar: Avatar;
  activePersona: Persona;
  memories: MemoryItem[];
  userPlan: PlanType;
  onAddMemory: (item: Omit<MemoryItem, 'id' | 'learnedAt'>) => void;
  onDeleteMemory: (id: string) => void;
  onOpenPlans: () => void;
}

const CATEGORY_META: Record<
  MemoryCategory,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  preferencia: {
    label: 'Preferências',
    icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
    color: 'text-rose-300',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  fato_pessoal: {
    label: 'Fatos Pessoais',
    icon: <Smile className="w-3.5 h-3.5 text-blue-400" />,
    color: 'text-blue-300',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  rotina: {
    label: 'Rotina & Hábitos',
    icon: <Coffee className="w-3.5 h-3.5 text-amber-400" />,
    color: 'text-amber-300',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  emocao: {
    label: 'Momentos & Emoções',
    icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    color: 'text-purple-300',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  apelido: {
    label: 'Apelidos Carinhosos',
    icon: <Heart className="w-3.5 h-3.5 text-pink-400" />,
    color: 'text-pink-300',
    bg: 'bg-pink-500/10 border-pink-500/30',
  },
  segredo: {
    label: 'Segredos & Confidências',
    icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  sonho: {
    label: 'Sonhos & Planos',
    icon: <Bookmark className="w-3.5 h-3.5 text-cyan-400" />,
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  data_especial: {
    label: 'Datas Especiais',
    icon: <Calendar className="w-3.5 h-3.5 text-indigo-400" />,
    color: 'text-indigo-300',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
};

export const MemoryDashboard: React.FC<MemoryDashboardProps> = ({
  activeAvatar,
  activePersona,
  memories,
  userPlan,
  onAddMemory,
  onDeleteMemory,
  onOpenPlans,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<MemoryCategory>('preferencia');
  const [newValue, setNewValue] = useState('');

  const personaMemories = memories.filter(
    (m) => m.personaId === activePersona.id || m.personaId === 'global'
  );

  const filteredMemories = personaMemories.filter((m) => {
    const matchesCategory = selectedCategory === 'todos' || m.category === selectedCategory;
    const matchesSearch =
      m.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    onAddMemory({
      userId: 'user_default',
      personaId: activePersona.id,
      category: newCategory,
      key: newCategory,
      value: newValue.trim(),
      importance: 3,
      confidence: 1.0,
    });

    setNewValue('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 text-slate-100 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 p-5 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-500/60 flex-shrink-0">
              <img
                src={activeAvatar.baseImage}
                alt={activeAvatar.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Memória Afetiva de {activeAvatar.name}</h2>
                <span className="text-[11px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  {personaMemories.length} memórias
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Armazenamento 100% local e privado. {activeAvatar.name} usa essas informações para lembrar de você com carinho.
              </p>
            </div>
          </div>

          <button
            id="btn-add-memory-toggle"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Memória</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Suas memórias ficam gravadas exclusivamente na memória local do seu dispositivo.</span>
        </div>
      </div>

      {/* Add Memory Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateMemory}
          className="bg-slate-900 p-4 rounded-2xl border border-rose-500/40 shadow-xl space-y-3 animate-fadeIn"
        >
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            O que {activeAvatar.name} deve lembrar sobre você?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Categoria da Memória</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Detalhe / Fato</label>
              <input
                type="text"
                required
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: Amo café sem açúcar, Tenho um cachorrinho chamado Toby, Faço aniversário em 14 de maio..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
            >
              Gravar Memória
            </button>
          </div>
        </form>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nas lembranças..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'todos'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            Todos ({personaMemories.length})
          </button>
          {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
            const count = personaMemories.filter((m) => m.category === catKey).length;
            if (count === 0 && selectedCategory !== catKey) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === catKey
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {meta.icon}
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory Items List */}
      {filteredMemories.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-2">
          <Brain className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Nenhuma memória encontrada</p>
          <p className="text-xs max-w-sm mx-auto text-slate-400">
            Conforme você conversa com {activeAvatar.name}, ele aprenderá automaticamente sobre seus gostos, ou você pode adicionar lembranças manualmente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredMemories.map((item) => {
            const meta = CATEGORY_META[item.category] || CATEGORY_META.preferencia;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col justify-between space-y-2 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-lg border font-medium ${meta.bg} ${meta.color}`}
                  >
                    {meta.icon}
                    <span>{meta.label}</span>
                  </span>

                  <button
                    id={`btn-del-memory-${item.id}`}
                    onClick={() => onDeleteMemory(item.id)}
                    title="Remover esta memória"
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 opacity-60 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">"{item.value}"</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Gravada em {new Date(item.learnedAt).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Confiabilidade: {Math.round(item.confidence * 100)}%</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
