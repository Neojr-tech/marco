import React, { useState } from 'react';
import { AffectiveOrientation, Avatar, PersonalityTrait, Persona, RelationshipStage } from '../../types';
import { X, Sparkles, Upload, Wand2, Plus, Heart } from 'lucide-react';

interface CustomAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (avatar: Avatar, persona: Persona) => void;
}

const TRAIT_OPTIONS: PersonalityTrait[] = [
  'romântico',
  'carinhoso',
  'brincalhão',
  'tímido',
  'ousado',
  'protetor',
  'ciumento',
  'dominante',
  'tranquilo',
  'intenso',
  'divertido',
  'reservado',
  'intelectual',
  'aventureiro',
];

const PRESET_STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
];

export const CustomAvatarModal: React.FC<CustomAvatarModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(27);
  const [profession, setProfession] = useState('Policial Federal');
  const [appearance, setAppearance] = useState('Homem atlético, cabelos escuros, olhar marcante e sorriso sedutor');
  const [imageUrl, setImageUrl] = useState(PRESET_STOCK_IMAGES[0]);
  const [selectedTraits, setSelectedTraits] = useState<PersonalityTrait[]>(['protetor', 'carinhoso', 'ousado']);
  const [orientation, setOrientation] = useState<AffectiveOrientation>('Heterossexual');
  const [speakingStyle, setSpeakingStyle] = useState('Afetuoso, confiante e envolvente');
  const [bio, setBio] = useState('Focado no trabalho e totalmente devoto à pessoa amada nos momentos a dois.');
  const [initialMessage, setInitialMessage] = useState('Cheguei agora em casa pensando em você o dia todo... Me dá um pouquinho da sua atenção?');

  if (!isOpen) return null;

  const toggleTrait = (t: PersonalityTrait) => {
    if (selectedTraits.includes(t)) {
      if (selectedTraits.length > 1) {
        setSelectedTraits(selectedTraits.filter((x) => x !== t));
      }
    } else {
      setSelectedTraits([...selectedTraits, t]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerateGreeting = () => {
    setInitialMessage(
      `Acabei de sair do meu expediente como ${profession} e não resisti em vir falar com você... Como foi seu dia, meu bem?`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe um nome para o avatar.');
      return;
    }

    const avatarId = `avatar_custom_${Date.now()}`;
    const personaId = `persona_custom_${Date.now()}`;

    const newAvatar: Avatar = {
      id: avatarId,
      name: name.trim(),
      age,
      appearance,
      baseImage: imageUrl,
      gallery: [imageUrl],
      tags: [profession, ...selectedTraits.slice(0, 2)],
      isCustom: true,
      createdAt: new Date().toISOString(),
      origin: 'user_created',
    };

    const newPersona: Persona = {
      id: personaId,
      avatarId,
      name: `${name} (${profession})`,
      profession,
      personalityTraits: selectedTraits,
      affectiveOrientation: orientation,
      speakingStyle,
      customBio: bio,
      initialMessage,
      currentMood: 'apaixonado',
      relationshipStage: 'paquerando',
      isDefault: true,
    };

    onCreate(newAvatar, newPersona);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
        <button
          id="btn-close-custom-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Criar Avatar & Persona Personalizada</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Defina a aparência, características comportamentais e estilo do seu par ideal.
            </p>
          </div>

          {/* Photo Selection / Upload */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Foto do Avatar</label>
            <div className="flex items-center gap-4">
              <img
                src={imageUrl}
                alt="Avatar preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Fazer upload de foto</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-slate-400">Ou escolha uma das fotos disponíveis abaixo:</p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pt-1">
              {PRESET_STOCK_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(img)}
                  className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    imageUrl === img ? 'border-rose-500 scale-105 shadow' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info: Name, Age, Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Matheus, Felipe..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Idade</label>
              <input
                type="number"
                min={18}
                max={65}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Profissão / Estilo</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Ex: Policial, Empresário..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Personality Traits Multi-Select */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Personalidade & Comportamento
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TRAIT_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTrait(t)}
                  className={`text-xs px-3 py-1 rounded-xl capitalize transition-all ${
                    selectedTraits.includes(t)
                      ? 'bg-rose-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation & Speaking Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Orientação Afetiva</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as AffectiveOrientation)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Heterossexual">Heterossexual</option>
                <option value="Bissexual">Bissexual</option>
                <option value="Homossexual">Homossexual</option>
                <option value="Pansexual">Pansexual</option>
                <option value="Livre">Livre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estilo de Fala</label>
              <input
                type="text"
                value={speakingStyle}
                onChange={(e) => setSpeakingStyle(e.target.value)}
                placeholder="Ex: Afetuoso, provocante, doce..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Initial Message with Auto-generate helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Mensagem Inicial</label>
              <button
                type="button"
                onClick={handleAutoGenerateGreeting}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                <span>Sugerir frase</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar e Criar Personagem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
