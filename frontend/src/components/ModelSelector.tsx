import React from 'react';
import { useChat } from '../hooks/useChat';

const ModelSelector: React.FC = () => {
  const { state, setSelectedModel } = useChat();

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedModel = state.availableModels.find(model => model.id === selectedId);
    if (selectedModel) {
      setSelectedModel(selectedModel);
    }
  };

  return (
    <div className="model-selector">
      <select
        id="model-select"
        value={state.selectedModel.id}
        onChange={handleModelChange}
        className="model-selector__select"
        disabled={state.isLoading}
        title="Selecionar modelo de IA"
      >
        {state.availableModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
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
