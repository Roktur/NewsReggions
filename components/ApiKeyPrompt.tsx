import React, { useState } from 'react';
import { clearOpenRouterApiKey, openApiKeySelection, saveOpenRouterApiKey } from '../services/geminiService';

interface ApiKeyPromptProps {
  onKeySelected: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySelected }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSaveKey = () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError('Вставьте OpenRouter API ключ.');
      return;
    }

    saveOpenRouterApiKey(trimmedKey);
    setError('');
    onKeySelected();
  };

  const handleOpenKeys = async () => {
    await openApiKeySelection();
  };

  const handleClearKey = () => {
    clearOpenRouterApiKey();
    setApiKey('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#222222] border border-[#333333] rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="mb-6 bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl text-indigo-300">
          🔑
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Требуется доступ</h2>
        <p className="text-slate-400 mb-6">
          Вставьте OpenRouter API ключ. Он сохранится локально в этом браузере и сразу начнет использоваться для генерации.
        </p>

        <div className="mb-4 text-left">
          <label htmlFor="openrouter-api-key" className="block text-sm font-medium text-slate-300 mb-2">
            OpenRouter API Key
          </label>
          <input
            id="openrouter-api-key"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              if (error) {
                setError('');
              }
            }}
            placeholder="sk-or-v1-..."
            className="w-full bg-[#181818] border border-[#3a3a3a] rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSaveKey}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-900/50"
          >
            Сохранить ключ
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleOpenKeys}
              className="w-full bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all border border-[#3d3d3d]"
            >
              Получить ключ
            </button>
            <button
              onClick={handleClearKey}
              className="w-full bg-[#2d2d2d] hover:bg-[#383838] text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all border border-[#3d3d3d]"
            >
              Очистить
            </button>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed">
            <a 
              href="https://openrouter.ai/docs/quickstart" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-indigo-400 underline"
            >
              Инструкция по OpenRouter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
