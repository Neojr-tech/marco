import React from "react";
import { QUICK_PROMPTS } from "../data/marcoProfile";

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled: boolean;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  onSelectPrompt,
  disabled,
}) => {
  return (
    <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <span className="text-xs font-semibold text-amber-500/90 whitespace-nowrap flex items-center gap-1">
          Sugestões rápidas:
        </span>

        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={disabled}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 hover:border-amber-500/40 whitespace-nowrap transition-all shadow-sm disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
