import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, User, Heart, Volume2, ShieldCheck, Sparkles, Save } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
}) => {
  const [name, setName] = useState(user.name);
  const [nickname, setNickname] = useState(user.nickname || '');
  const [bio, setBio] = useState(user.bio || '');
  const [gender, setGender] = useState(user.gender || 'Feminino');
  const [interestedIn, setInterestedIn] = useState<string[]>(user.interestedIn || ['Masculino']);
  const [autoSpeak, setAutoSpeak] = useState(user.autoSpeakResponses);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...user,
      name: name.trim() || 'Usuário',
      nickname: nickname.trim(),
      bio: bio.trim(),
      gender,
      interestedIn,
      autoSpeakResponses: autoSpeak,
    });
    onClose();
  };

  const toggleInterest = (val: string) => {
    if (interestedIn.includes(val)) {
      if (interestedIn.length > 1) {
        setInterestedIn(interestedIn.filter((i) => i !== val));
      }
    } else {
      setInterestedIn([...interestedIn, val]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          id="btn-close-user-modal"
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Seu Perfil de Usuário</h2>
            <p className="text-xs text-slate-400">
              Personalize como os avatares se dirigem e se lembram de você.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seu Nome</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Apelido Carinhoso (Opcional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Meu bem, Vida, Amor..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Sobre Você (Gostos, dia a dia, trabalho)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: Trabalho com design, gosto de cinema e café nos fins de semana..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Interesses Afetivos
            </label>
            <div className="flex gap-2">
              {['Masculino', 'Feminino', 'Não-binário', 'Todos'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleInterest(g)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                    interestedIn.includes(g)
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Volume2 className="w-4 h-4 text-rose-400" />
              <span>Ouvir respostas em voz alta automaticamente</span>
            </div>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
