import React, { useState } from 'react';
import { EngineConfig, ModelProvider } from '../../types';
import { StorageService } from '../../modules/storage/StorageService';
import {
  X,
  Cpu,
  Sparkles,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  Sliders,
  Server,
  Lock,
  Zap,
} from 'lucide-react';

interface EngineSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineConfig: EngineConfig;
  onUpdateEngineConfig: (config: EngineConfig) => void;
  onDataImported: () => void;
}

export const EngineSettingsModal: React.FC<EngineSettingsModalProps> = ({
  isOpen,
  onClose,
  engineConfig,
  onUpdateEngineConfig,
  onDataImported,
}) => {
  const [config, setConfig] = useState<EngineConfig>({ ...engineConfig });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (provider: ModelProvider) => {
    let modelName = config.modelName;
    if (provider === 'gemini') modelName = 'gemini-3.7-flash';
    if (provider === 'local_gguf') modelName = 'Meta-Llama-3-8B-Instruct-Q4_K_M.gguf';
    if (provider === 'offline_simulated') modelName = 'AmorVirtual-Offline-RuleEngine-v1';

    const updated = {
      ...config,
      provider,
      modelName,
      isOfflineMode: provider === 'offline_simulated',
    };
    setConfig(updated);
    onUpdateEngineConfig(updated);
  };

  const handleSave = () => {
    onUpdateEngineConfig(config);
    onClose();
  };

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amorvirtual_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const success = StorageService.importData(reader.result as string);
        if (success) {
          alert('Dados restaurados com sucesso!');
          onDataImported();
          onClose();
        } else {
          alert('Erro ao importar arquivo. Verifique o formato.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        'ATENÇÃO: Isso apagará todas as conversas, memórias e personagens criados localmente. Deseja continuar?'
      )
    ) {
      StorageService.clearAllData();
      alert('Todos os dados locais foram apagados.');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 space-y-6">
        <button
          id="btn-close-settings-modal"
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
            <Cpu className="w-4 h-4" />
            <span>Arquitetura Modular de IA & Privacidade</span>
          </div>
          <h2 className="text-xl font-bold text-white">Configuração dos Motores</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Troque o motor conversacional em tempo real sem afetar memórias ou personas.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Motor Conversacional Ativo
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Gemini 3.7 Flash Cloud */}
            <button
              type="button"
              onClick={() => handleProviderChange('gemini')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.provider === 'gemini'
                  ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                {config.provider === 'gemini' && (
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                    ATIVO
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Gemini 3.7 Flash</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Máxima empatia, raciocínio afetivo e naturalidade em português.
                </p>
              </div>
            </button>

            {/* 2. Local GGUF Engine */}
            <button
              type="button"
              onClick={() => handleProviderChange('local_gguf')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.provider === 'local_gguf'
                  ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Server className="w-5 h-5 text-purple-400" />
                {config.provider === 'local_gguf' && (
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 font-bold px-1.5 py-0.5 rounded">
                    ATIVO
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">GGUF Local</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Llama 3 / Mistral via llama.cpp local (localhost:8080).
                </p>
              </div>
            </button>

            {/* 3. 100% Offline Rule Engine */}
            <button
              type="button"
              onClick={() => handleProviderChange('offline_simulated')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                config.provider === 'offline_simulated'
                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                {config.provider === 'offline_simulated' && (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    ATIVO
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Offline</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Zero rede. Respostas instantâneas e privacidade absoluta.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Local GGUF Endpoint input if selected */}
        {config.provider === 'local_gguf' && (
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-purple-500/40 space-y-2">
            <label className="block text-xs font-semibold text-purple-300">
              Endpoint do Servidor Local (llama.cpp / Ollama / LocalAI)
            </label>
            <input
              type="text"
              value={config.localEndpoint || 'http://localhost:8080/v1/chat/completions'}
              onChange={(e) => setConfig({ ...config, localEndpoint: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-[10px] text-slate-400">
              Compatível com qualquer servidor padrão OpenAI-like local na sua máquina ou rede local.
            </p>
          </div>
        )}

        {/* Temperature / Affective Warmth Slider */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Sensibilidade & Criatividade Afetiva (Temperature)
            </span>
            <span className="font-bold text-rose-400">{config.temperature}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.2"
            step="0.05"
            value={config.temperature}
            onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Mais previsível e direto (0.2)</span>
            <span>Equilibrado (0.7)</span>
            <span>Mais poético, caloroso e apaixonado (1.2)</span>
          </div>
        </div>

        {/* Privacy & Data Management */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Soberania & Privacidade de Dados</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seus chats, memórias e personagens nunca ficam presos no aplicativo. Você tem controle total para exportar um backup ou apagar tudo a qualquer momento.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              id="btn-export-backup"
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Exportar Backup (JSON)</span>
            </button>

            <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium transition-colors">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Restaurar Backup</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>

            <button
              id="btn-wipe-data"
              onClick={handleClearAllData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-800/60 text-xs text-red-300 font-medium transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Apagar Tudo</span>
            </button>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
          >
            Aplicar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
