import React from 'react';
import { useChatActions } from '../hooks/useChat';

const ModelSelector: React.FC = () => {
  const { 
    selectedModel, 
    availableModels, 
    isLoading, 
    handleModelChange 
  } = useChatActions();

  return (
    <div className="model-selector">
      <select
        id="model-select"
        value={selectedModel.id}
        onChange={(e) => handleModelChange(e.target.value)}
        className="model-selector__select"
        disabled={isLoading}
        title="Selecionar modelo de IA"
      >
        {availableModels.length > 0 ? (
          availableModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))
        ) : (
          <option value="">Carregando modelos...</option>
        )}
      </select>
      <svg 
        className="model-selector__icon" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
  );
};

export default ModelSelector;
