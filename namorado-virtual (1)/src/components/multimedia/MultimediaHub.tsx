import React, { useState } from 'react';
import { Avatar, MediaItem, Persona, UsageCredits } from '../../types';
import {
  Camera,
  Video,
  Sparkles,
  Lock,
  Play,
  Download,
  Share2,
  Plus,
  Heart,
  Eye,
  Filter,
} from 'lucide-react';

interface MultimediaHubProps {
  activeAvatar: Avatar;
  activePersona: Persona;
  mediaItems: MediaItem[];
  usage: UsageCredits;
  onGeneratePhoto: (situation: string) => Promise<void>;
  onGenerateVideo: (theme: string) => Promise<void>;
  onUnlockMedia: (mediaId: string, cost: number) => void;
  onOpenPlans: () => void;
}

export const MultimediaHub: React.FC<MultimediaHubProps> = ({
  activeAvatar,
  activePersona,
  mediaItems,
  usage,
  onGeneratePhoto,
  onGenerateVideo,
  onUnlockMedia,
  onOpenPlans,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genType, setGenType] = useState<'photo' | 'video'>('photo');
  const [genSituation, setGenSituation] = useState('Tomando um café no intervalo e pensando em você');

  const avatarMedia = mediaItems.filter(
    (m) => m.avatarId === activeAvatar.id || m.avatarId === 'all'
  );

  const filteredMedia = avatarMedia.filter((m) => {
    if (filterType === 'all') return true;
    return m.type === filterType;
  });

  const handleRequestGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genSituation.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      if (genType === 'photo') {
        await onGeneratePhoto(genSituation.trim());
      } else {
        await onGenerateVideo(genSituation.trim());
      }
      setShowGenerateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const situationPresets = [
    'Selfie sorrindo no intervalo do trabalho',
    'Cozinhando nosso prato favorito',
    'Passeando no parque em um dia de sol',
    'Deitado no sofá mandando boa noite',
    'Arrumado elegante para um jantar a dois',
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 text-slate-100 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Galeria & Multimídia</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              {activeAvatar.name}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fotos exclusivas, selfies da rotina e vídeos especiais de {activeAvatar.name}.
          </p>
        </div>

        <button
          id="btn-open-generate-media"
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all active:scale-95 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Pedir Nova Foto ou Vídeo</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
            filterType === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          Todos ({avatarMedia.length})
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            filterType === 'image'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Fotos ({avatarMedia.filter((m) => m.type === 'image').length})</span>
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            filterType === 'video'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Vídeos ({avatarMedia.filter((m) => m.type === 'video').length})</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {filteredMedia.map((item) => {
          const isVideo = item.type === 'video';
          const isLocked = item.isPremium && !item.unlocked && usage.plan === 'free';

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isLocked) {
                  onUnlockMedia(item.id, item.unlockCostCredits || 2);
                  return;
                }
                if (isVideo) setSelectedVideo(item);
                else setSelectedImage(item);
              }}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer aspect-square shadow-sm"
            >
              {/* Media Preview Image / Thumbnail */}
              {isVideo ? (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center relative">
                  <video src={item.url} className="w-full h-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-slate-200">
                    {item.durationSeconds || 12}s
                  </span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Lock Badge if Premium & Free plan */}
              {isLocked ? (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                  <Lock className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-[11px] font-bold text-amber-300">Desbloquear</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {item.unlockCostCredits || 2} créditos
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white truncate drop-shadow">{item.title}</p>
                  <p className="text-[10px] text-rose-300 truncate">{item.situation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Generate Photo / Video Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Pedir Multimídia a {activeAvatar.name}</span>
            </h3>

            {/* Type Switcher */}
            <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setGenType('photo')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  genType === 'photo' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto / Selfie</span>
              </button>
              <button
                type="button"
                onClick={() => setGenType('video')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  genType === 'video' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Recado em Vídeo</span>
              </button>
            </div>

            {/* Situation Input & Presets */}
            <form onSubmit={handleRequestGeneration} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  O que {activeAvatar.name} deve estar fazendo?
                </label>
                <textarea
                  rows={2}
                  required
                  value={genSituation}
                  onChange={(e) => setGenSituation(e.target.value)}
                  placeholder="Descreva o momento ou local..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">Sugestões rápidas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {situationPresets.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGenSituation(s)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Preparando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gerar Agora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-screen Photo Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-sm">{selectedImage.title}</h4>
                <p className="text-xs text-rose-300">{selectedImage.description}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs"
              >
                Fechar ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Video Player */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl max-h-[80vh] bg-black"
            />
            <div className="mt-3 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-sm">{selectedVideo.title}</h4>
                <p className="text-xs text-slate-400">{selectedVideo.description}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs"
              >
                Fechar ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
