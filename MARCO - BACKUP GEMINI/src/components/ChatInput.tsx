import React, { useState, useRef } from "react";
import { SendHorizontal, Camera, Video, Smile, Mic } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const QUICK_EMOJIS = ["💖", "🔥", "😉", "💋", "🏖️", "☀️", "🥺", "🥰", "🌴", "😈"];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    setShowEmojiPicker(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleRequestPhoto = () => {
    onSendMessage("Marco, me manda uma foto sua agora?");
  };

  const handleRequestVideo = () => {
    onSendMessage("Marco, vida, me manda um vídeo seu?");
  };

  return (
    <div className="sticky bottom-0 z-20 bg-slate-900/95 border-t border-amber-500/20 p-3 backdrop-blur-md shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Quick Emojis Drawer */}
        {showEmojiPicker && (
          <div className="flex items-center gap-2 p-2 bg-slate-800/90 rounded-xl border border-slate-700/80 overflow-x-auto scrollbar-none animate-fade-in">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1.5 hover:bg-slate-700 rounded-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRequestPhoto}
              title="Pedir Foto ao Marco"
              disabled={isLoading}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-slate-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRequestVideo}
              title="Pedir Vídeo ao Marco"
              disabled={isLoading}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Emojis carinhosos"
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Fale com o Marco (ex: Oii lindo, me manda uma foto...)"
              disabled={isLoading}
              className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-sm sm:text-base rounded-full px-4 py-2.5 pr-10 border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                setInput((prev) => prev + " 🎙️ (fala comigo amor)");
                inputRef.current?.focus();
              }}
              title="Mensagem de voz"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full font-medium transition-all flex items-center justify-center ${
              input.trim() && !isLoading
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-105"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
