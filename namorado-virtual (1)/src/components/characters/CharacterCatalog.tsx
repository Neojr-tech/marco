import React, { useState } from 'react';
import { Avatar, Persona, PlanType } from '../../types';
import { Heart, Sparkles, Plus, UserCheck, Sliders, Shield } from 'lucide-react';

interface CharacterCatalogProps {
  avatars: Avatar[];
  personas: Persona[];
  activeAvatarId: string;
  userPlan: PlanType;
  onSelectAvatar: (avatarId: string) => void;
  onOpenCharacterDetail: (avatar: Avatar) => void;
  onOpenCustomAvatarBuilder: () => void;
}

export const CharacterCatalog: React.FC<CharacterCatalogProps> = ({
  avatars,
  personas,
  activeAvatarId,
  userPlan,
  onSelectAvatar,
  onOpenCharacterDetail,
  onOpenCustomAvatarBuilder,
}) => {
  const [filterTag, setFilterTag] = useState<string>('todos');

  // Collect all unique tags
  const allTags = ['todos', ...Array.from(new Set(avatars.flatMap((a) => a.tags)))];

  const filteredAvatars = avatars.filter((avatar) => {
    if (filterTag === 'todos') return true;
    return avatar.tags.includes(filterTag);
  });

  const getPersonaForAvatar = (avatarId: string): Persona | undefined => {
    return personas.find((p) => p.avatarId === avatarId) || personas[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 text-slate-100">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Personagens & Avatares</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {avatars.length} disponíveis
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Escolha seu companheiro virtual ou crie um avatar personalizado com personas modulares.
          </p>
        </div>

        <button
          id="btn-create-custom-avatar"
          onClick={onOpenCustomAvatarBuilder}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Avatar Personalizado</span>
        </button>
      </div>

      {/* Filter Tags Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-xl capitalize font-medium transition-all whitespace-nowrap ${
              filterTag === tag
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Avatars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAvatars.map((avatar) => {
          const persona = getPersonaForAvatar(avatar.id);
          const isActive = avatar.id === activeAvatarId;

          return (
            <div
              key={avatar.id}
              className={`bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                isActive
                  ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-lg shadow-rose-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Image Banner */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={avatar.baseImage}
                  alt={avatar.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {avatar.isCustom ? (
                    <span className="text-[10px] bg-purple-600/90 text-white font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Personalizado
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-900/80 text-rose-300 font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-rose-500/30">
                      {persona?.profession || 'Oficial'}
                    </span>
                  )}
                </div>

                {isActive && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Ativo
                  </div>
                )}

                {/* Name & Age Overlay */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {avatar.name}, <span className="text-slate-300 font-normal">{avatar.age}</span>
                  </h3>
                  <p className="text-[11px] text-rose-300 truncate">
                    {persona?.personalityTraits.join(' • ') || 'Carinhoso, Romântico'}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {persona?.customBio || avatar.appearance}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {avatar.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`btn-chat-avatar-${avatar.id}`}
                    onClick={() => onSelectAvatar(avatar.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isActive ? 'fill-white' : 'text-rose-400'}`} />
                    <span>{isActive ? 'Conversando' : 'Escolher'}</span>
                  </button>

                  <button
                    id={`btn-detail-avatar-${avatar.id}`}
                    onClick={() => onOpenCharacterDetail(avatar)}
                    title="Ver perfil e personalizar persona"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
