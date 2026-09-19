import React, { useState } from "react";
import { UserMemory } from "../types";
import { Heart, Plus, Trash2, X, Sparkles, Calendar, Bookmark, BookmarkCheck } from "lucide-react";

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  memory: UserMemory;
  onUpdateMemory: (newMemory: UserMemory) => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  isOpen,
  onClose,
  memory,
  onUpdateMemory,
}) => {
  const [newDream, setNewDream] = useState("");
  const [newLike, setNewLike] = useState("");
  const [newDate, setNewDate] = useState("");

  if (!isOpen) return null;

  const handleAddLike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLike.trim()) return;
    onUpdateMemory({
      ...memory,
      likes: [...(memory.likes || []), newLike.trim()],
    });
    setNewLike("");
  };

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDream.trim()) return;
    onUpdateMemory({
      ...memory,
      dreams: [...(memory.dreams || []), newDream.trim()],
    });
    setNewDream("");
  };

  const handleAddDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate.trim()) return;
    onUpdateMemory({
      ...memory,
      importantDates: [...(memory.importantDates || []), newDate.trim()],
    });
    setNewDate("");
  };

  const handleRemoveItem = (key: keyof UserMemory, index: number) => {
    const list = [...((memory[key] as string[]) || [])];
    list.splice(index, 1);
    onUpdateMemory({
      ...memory,
      [key]: list,
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <Heart className="w-6 h-6 fill-rose-500/50" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Memórias do Nosso Amor 💖
            </h2>
            <p className="text-xs text-slate-400">
              O Marco guarda tudo com muito carinho: seus gostos, sonhos, segredos e datas importantes.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-6">
          {/* Likes section */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-2">
              <BookmarkCheck className="w-4 h-4" />
              O que você gosta:
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {(memory.likes || []).length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Nenhum gosto registrado ainda. Fale para o Marco no chat!
                </span>
              ) : (
                memory.likes?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveItem("likes", idx)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <form onSubmit={handleAddLike} className="flex gap-2">
              <input
                type="text"
                value={newLike}
                onChange={(e) => setNewLike(e.target.value)}
                placeholder="Adicionar um gosto (ex: Praia, Acarajé, Caipirinha)..."
                className="flex-1 bg-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </form>
          </div>

          {/* Dreams section */}
          <div>
            <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              Seus Sonhos e Desejos:
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {(memory.dreams || []).length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Nenhum sonho registrado ainda.
                </span>
              ) : (
                memory.dreams?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveItem("dreams", idx)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <form onSubmit={handleAddDream} className="flex gap-2">
              <input
                type="text"
                value={newDream}
                onChange={(e) => setNewDream(e.target.value)}
                placeholder="Adicionar um sonho (ex: Viajar pra Salvador com você)..."
                className="flex-1 bg-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </form>
          </div>

          {/* Important Dates section */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Datas Especiais:
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {(memory.importantDates || []).length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Nenhuma data registrada.
                </span>
              ) : (
                memory.importantDates?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveItem("importantDates", idx)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <form onSubmit={handleAddDate} className="flex gap-2">
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder="Adicionar uma data (ex: Nosso aniversário dia 15 de Outubro)..."
                className="flex-1 bg-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
