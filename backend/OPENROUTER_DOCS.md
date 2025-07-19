# OpenRouter Integration - Documentação

## Configuração

1. Obtenha sua API key do OpenRouter em: https://openrouter.ai/keys
2. Copie o arquivo `.env.example` para `.env` e configure:

```bash
OPENROUTER_API_KEY=sua_chave_api_aqui
APP_NAME=TCC Backend
HTTP_REFERER=http://localhost:3000
```

## Endpoints Disponíveis

### 1. Listar Modelos
**GET** `/api/chat/models`

Retorna todos os modelos LLM disponíveis no OpenRouter.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "anthropic/claude-3-opus",
      "name": "Claude 3 Opus",
      "context_length": 200000,
      "pricing": {
        "prompt": "0.000015",
        "completion": "0.000075"
      }
    }
  ],
  "count": 150
}
```

### 2. Filtrar Modelos
**GET** `/api/chat/models/filtered?maxPrice=0.001&search=gpt`

Query parameters:
- `maxPrice`: Preço máximo por token
- `minContextLength`: Tamanho mínimo do contexto
- `search`: Busca por nome/descrição
- `provider`: Filtrar por provedor

### 3. Enviar Mensagem Simples
**POST** `/api/chat/message`

```json
{
  "model": "openai/gpt-3.5-turbo",
  "message": "Explique quantum computing",
  "systemPrompt": "Você é um professor de física.",
  "maxTokens": 500,
  "temperature": 0.7
}
```

### 4. Conversa com Contexto
**POST** `/api/chat/conversation`

```json
{
  "model": "anthropic/claude-3-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "Você é um assistente útil."
    },
    {
      "role": "user",
      "content": "Olá, como você está?"
    },
    {
      "role": "assistant", 
      "content": "Olá! Estou bem, obrigado por perguntar."
    },
    {
      "role": "user",
      "content": "Pode me ajudar com programação?"
    }
  ],
  "maxTokens": 1000,
  "temperature": 0.8
}
```

### 5. Chat Completion Completo
**POST** `/api/chat/complete`

```json
{
  "model": "meta-llama/llama-2-70b-chat",
  "messages": [
    {
      "role": "user",
      "content": "Escreva um poema sobre tecnologia"
    }
  ],
  "max_tokens": 800,
  "temperature": 0.9,
  "top_p": 0.95,
  "frequency_penalty": 0.1,
  "presence_penalty": 0.1
}
```

### 6. Calcular Custo Estimado
**POST** `/api/chat/cost-estimate`

```json
{
  "modelId": "openai/gpt-4",
  "promptTokens": 100,
  "completionTokens": 200
}
```

### 7. Health Check
**GET** `/api/chat/health`

Verifica se a API do OpenRouter está funcionando.

## Modelos Populares

### Texto/Chat
- `openai/gpt-4`: GPT-4 (melhor qualidade)
- `openai/gpt-3.5-turbo`: GPT-3.5 Turbo (custo-benefício)
- `anthropic/claude-3-opus`: Claude 3 Opus (excelente para análise)
- `anthropic/claude-3-sonnet`: Claude 3 Sonnet (balanceado)
- `meta-llama/llama-2-70b-chat`: Llama 2 70B (open source)
- `google/gemini-pro`: Gemini Pro (Google)

### Código
- `anthropic/claude-3-opus`: Excelente para programação
- `openai/gpt-4`: Muito bom para código
- `deepseek/deepseek-coder-33b-instruct`: Especializado em código

### Custo-Benefício
- `openai/gpt-3.5-turbo`: Barato e eficiente
- `meta-llama/llama-2-13b-chat`: Open source, muito barato
- `anthropic/claude-3-haiku`: Rápido e barato da Anthropic

## Uso no Código

```typescript
import { getOpenRouterService } from './services/OpenRouterService';

// Inicializar o serviço
const openRouter = getOpenRouterService();

// Enviar mensagem simples
const response = await openRouter.sendMessage(
  'openai/gpt-3.5-turbo',
  'Explique machine learning',
  'Você é um professor de ciência da computação'
);

// Conversa com contexto
const messages = [
  { role: 'user', content: 'Olá!' },
  { role: 'assistant', content: 'Oi! Como posso ajudar?' },
  { role: 'user', content: 'Explique APIs REST' }
];

const result = await openRouter.conversationChat(
  'anthropic/claude-3-sonnet',
  messages
);
```

## Tratamento de Erros

Todos os métodos podem lançar erros. Sempre use try/catch:

```typescript
try {
  const response = await openRouter.sendMessage(model, message);
  console.log(response);
} catch (error) {
  console.error('Erro:', error.message);
  // Tratar erro apropriadamente
}
```

## Limites e Considerações

1. **Rate Limits**: OpenRouter tem limites de requisições por minuto
2. **Custos**: Cada modelo tem preços diferentes por token
3. **Context Length**: Cada modelo tem limite máximo de tokens
4. **Timeout**: Requisições têm timeout de 60 segundos
5. **API Key**: Mantenha sua chave segura e não a exponha no frontend

## Dicas de Uso

1. **Use system prompts** para definir o comportamento do modelo
2. **Ajuste temperature** (0.0-1.0) para controlar criatividade
3. **Use max_tokens** para limitar o tamanho da resposta
4. **Escolha o modelo certo** para sua tarefa específica
5. **Monitore custos** usando o endpoint de estimativa
