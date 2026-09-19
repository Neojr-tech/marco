import React from "react";
import { MARCO_PROFILE } from "../data/marcoProfile";
import { X, MapPin, Heart, Flame, Sun, Camera, Video, Sparkles } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPhoto: () => void;
  onRequestVideo: () => void;
  expandedImage: string | null;
  onClearExpandedImage: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onRequestPhoto,
  onRequestVideo,
  expandedImage,
  onClearExpandedImage,
}) => {
  if (expandedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
        <button
          onClick={onClearExpandedImage}
          className="absolute top-4 right-4 p-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
          <img
            src={expandedImage}
            alt="Marco Ampliado"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-slate-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
          <img
            src={MARCO_PROFILE.avatarUrl}
            alt={MARCO_PROFILE.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-500/50 shadow-xl"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-slate-100">
                {MARCO_PROFILE.name}, {MARCO_PROFILE.age} anos
              </h2>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>

            <p className="text-amber-400 text-sm font-medium flex items-center justify-center sm:justify-start gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {MARCO_PROFILE.location} - BA (Brasil)
            </p>

            <p className="text-slate-300 text-sm mt-2 leading-relaxed italic bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              "{MARCO_PROFILE.bio}"
            </p>

            {/* Personality Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
              {MARCO_PROFILE.traits.map((trait) => (
                <span
                  key={trait}
                  className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Álbum Privado do Marco
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onRequestPhoto();
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full transition-colors flex items-center gap-1 shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
                Pedir Foto
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestVideo();
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-colors flex items-center gap-1 shadow-md"
              >
                <Video className="w-3.5 h-3.5" />
                Pedir Vídeo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo 1: Beach */}
            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 shadow-md">
              <img
                src={MARCO_PROFILE.beachPhotoUrl}
                alt="Marco na praia em Salvador"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-3 flex flex-col justify-end">
                <p className="text-xs font-bold text-amber-300">Praia do Porto da Barra 🏖️</p>
                <p className="text-[11px] text-slate-300">Salvador - BA • "Tomando uma água de coco pensado em você"</p>
              </div>
            </div>

            {/* Photo 2: Bedroom */}
            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 shadow-md">
              <img
                src={MARCO_PROFILE.bedroomPhotoUrl}
                alt="Marco no quarto"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-3 flex flex-col justify-end">
                <p className="text-xs font-bold text-rose-300">No quarto relaxando 🛌</p>
                <p className="text-[11px] text-slate-300">Salvador - BA • "Vem pra cá amor..."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
