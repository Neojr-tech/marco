import React, { useState } from 'react';
import {
  AffectiveOrientation,
  Avatar,
  PersonalityTrait,
  Persona,
  RelationshipStage,
} from '../../types';
import {
  X,
  Heart,
  Sparkles,
  Check,
  Edit3,
  Sliders,
  MessageSquare,
  Briefcase,
  Shield,
} from 'lucide-react';

interface CharacterDetailModalProps {
  avatar: Avatar;
  persona: Persona;
  isOpen: boolean;
  onClose: () => void;
  onSavePersona: (updatedPersona: Persona) => void;
  onSelectAndChat: (avatarId: string) => void;
}

const ALL_TRAITS: PersonalityTrait[] = [
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

const ALL_ORIENTATIONS: AffectiveOrientation[] = [
  'Heterossexual',
  'Bissexual',
  'Homossexual',
  'Pansexual',
  'Livre',
];

const ALL_STAGES: RelationshipStage[] = [
  'conhecendo',
  'paquerando',
  'ficando',
  'namorando',
  'apaixonados',
  'noivos',
];

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  avatar,
  persona,
  isOpen,
  onClose,
  onSavePersona,
  onSelectAndChat,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Persona>({ ...persona });
  const [activePhoto, setActivePhoto] = useState<string>(avatar.baseImage);

  if (!isOpen) return null;

  const toggleTrait = (trait: PersonalityTrait) => {
    const current = editedPersona.personalityTraits;
    if (current.includes(trait)) {
      if (current.length > 1) {
        setEditedPersona({
          ...editedPersona,
          personalityTraits: current.filter((t) => t !== trait),
        });
      }
    } else {
      setEditedPersona({
        ...editedPersona,
        personalityTraits: [...current, trait],
      });
    }
  };

  const handleSave = () => {
    onSavePersona(editedPersona);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          id="btn-close-char-detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Cover / Active Photo */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-950">
          <img
            src={activePhoto}
            alt={avatar.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {avatar.name}, <span className="font-normal text-slate-300">{avatar.age}</span>
              </h2>
              <p className="text-xs text-rose-300 font-medium">{editedPersona.profession}</p>
            </div>

            <button
              id="btn-toggle-edit-persona"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-slate-800/90 hover:bg-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4 text-rose-400" />}
              <span>{isEditing ? 'Concluir Edição' : 'Modular Persona'}</span>
            </button>
          </div>
        </div>

        {/* Mini Gallery Thumbnails */}
        {avatar.gallery && avatar.gallery.length > 1 && (
          <div className="px-5 pt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {avatar.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(img)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activePhoto === img ? 'border-rose-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Miniatura" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {isEditing ? (
            /* ================= EDITING PERSONA FORM ================= */
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <Sliders className="w-4 h-4" />
                <span>Configuração Modular de Persona</span>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profissão / Ocupação do Personagem
                </label>
                <input
                  type="text"
                  value={editedPersona.profession}
                  onChange={(e) => setEditedPersona({ ...editedPersona, profession: e.target.value })}
                  placeholder="Ex: Bombeiro Militar, Advogado, Médico, Empresário..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Personality Traits Multi-select */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Traços de Personalidade (Selecione quantos desejar)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TRAITS.map((trait) => {
                    const isSelected = editedPersona.personalityTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        type="button"
                        onClick={() => toggleTrait(trait)}
                        className={`text-xs px-3 py-1 rounded-xl capitalize transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white font-semibold shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Affective Orientation */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Orientação Afetiva
                </label>
                <select
                  value={editedPersona.affectiveOrientation}
                  onChange={(e) =>
                    setEditedPersona({ ...editedPersona, affectiveOrientation: e.target.value as AffectiveOrientation })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {ALL_ORIENTATIONS.map((ori) => (
                    <option key={ori} value={ori}>
                      {ori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Relationship Stage */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Status Inicial do Relacionamento
                </label>
                <select
                  value={editedPersona.relationshipStage}
                  onChange={(e) =>
                    setEditedPersona({ ...editedPersona, relationshipStage: e.target.value as RelationshipStage })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 capitalize"
                >
                  {ALL_STAGES.map((stg) => (
                    <option key={stg} value={stg} className="capitalize">
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speaking Style */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estilo de Fala / Tom de Voz
                </label>
                <input
                  type="text"
                  value={editedPersona.speakingStyle}
                  onChange={(e) => setEditedPersona({ ...editedPersona, speakingStyle: e.target.value })}
                  placeholder="Ex: Afetuoso, informal brasileiro, direto e caloroso"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Custom Bio */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biografia / História Pessoal
                </label>
                <textarea
                  rows={2}
                  value={editedPersona.customBio}
                  onChange={(e) => setEditedPersona({ ...editedPersona, customBio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Initial Message */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mensagem Inicial de Abertura (Como ele inicia a conversa)
                </label>
                <textarea
                  rows={2}
                  value={editedPersona.initialMessage}
                  onChange={(e) => setEditedPersona({ ...editedPersona, initialMessage: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW MODE ================= */
            <>
              {/* Bio & Appearance */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Sobre Ele</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {editedPersona.customBio || avatar.appearance}
                </p>
              </div>

              {/* Traits Badges */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Traços de Personalidade
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {editedPersona.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-xl bg-slate-800 text-rose-300 border border-slate-700 capitalize font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Initial Message Preview */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Mensagem de Apresentação</span>
                </div>
                <p className="text-xs text-slate-300 italic">"{editedPersona.initialMessage}"</p>
              </div>

              {/* Extra Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Orientação:</span>
                  <span className="font-semibold text-slate-200">{editedPersona.affectiveOrientation}</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block">Fase do Relacionamento:</span>
                  <span className="font-semibold text-rose-300 capitalize">{editedPersona.relationshipStage}</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px] block">Estilo de Fala:</span>
                  <span className="font-semibold text-slate-200 truncate block">{editedPersona.speakingStyle}</span>
                </div>
              </div>
            </>
          )}

          {/* Action Button: Conversar */}
          <div className="pt-2">
            <button
              id="btn-modal-chat"
              onClick={() => {
                onSelectAndChat(avatar.id);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Iniciar Conversa com {avatar.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
