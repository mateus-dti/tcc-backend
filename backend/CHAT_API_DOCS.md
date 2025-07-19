# Chat API - Endpoints Simplificados

## Endpoints de Chat

### 1. Chat Simples (Recomendado)
**POST** `/api/chat/simple`

O endpoint mais simples - apenas precisa do ID do modelo e da mensagem.

**Corpo da requisição:**
```json
{
  "modelId": "openai/gpt-3.5-turbo",
  "message": "Olá, como você está?"
}
```

**Resposta:**
```json
{
  "success": true,
  "modelId": "openai/gpt-3.5-turbo",
  "message": "Olá, como você está?",
  "response": "Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?"
}
```

### 2. Chat com Configurações
**POST** `/api/chat/message`

Permite configurações básicas com valores padrão otimizados.

**Corpo da requisição:**
```json
{
  "modelId": "openai/gpt-3.5-turbo",
  "message": "Explique machine learning"
}
```

### 3. Chat com Contexto
**POST** `/api/chat/conversation`

Mantém contexto de conversas anteriores.

**Corpo da requisição:**
```json
{
  "modelId": "anthropic/claude-3-sonnet",
  "message": "Continua nossa conversa sobre ML",
  "context": [
    "Olá, me explique machine learning",
    "Machine learning é uma técnica...",
    "Interessante! E deep learning?"
  ]
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "response": "Deep learning é um subconjunto...",
    "modelId": "anthropic/claude-3-sonnet",
    "message": "Continua nossa conversa sobre ML",
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 200,
      "total_tokens": 350
    },
    "updatedContext": [
      "Olá, me explique machine learning",
      "Machine learning é uma técnica...",
      "Interessante! E deep learning?",
      "Deep learning é um subconjunto..."
    ]
  }
}
```

### 4. Chat Avançado
**POST** `/api/chat/complete`

Controle total sobre parâmetros.

**Corpo da requisição:**
```json
{
  "modelId": "openai/gpt-4",
  "message": "Escreva um poema",
  "options": {
    "maxTokens": 500,
    "temperature": 0.9,
    "topP": 0.95
  }
}
```

## Endpoints de Modelos (Seus modelos locais)

### Listar Modelos Disponíveis
**GET** `/api/models/list`

```json
{
  "success": true,
  "data": [
    {
      "id": "openai/gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo"
    },
    {
      "id": "anthropic/claude-3-sonnet",
      "name": "Claude 3 Sonnet"
    }
  ],
  "count": 2
}
```

### Buscar Modelos
**GET** `/api/models/search?q=gpt`

### Modelos por Categoria
**GET** `/api/models/category/openai`

### Modelos Gratuitos
**GET** `/api/models/free`

### Sugestões por Caso de Uso
**GET** `/api/models/suggest/coding`

Casos de uso disponíveis:
- `coding` - Programação
- `conversation` - Conversa
- `free` - Modelos gratuitos
- `translation` - Tradução
- `analysis` - Análise
- `creative` - Criativo
- `fast` - Rápido

## Endpoints OpenRouter (Modelos da API)

### Listar Todos os Modelos OpenRouter
**GET** `/api/chat/models`

### Filtrar Modelos OpenRouter
**GET** `/api/chat/models/filtered?search=gpt&maxPrice=0.01`

### Health Check
**GET** `/api/chat/health`

### Calcular Custo
**POST** `/api/chat/cost-estimate`

```json
{
  "modelId": "openai/gpt-3.5-turbo",
  "promptTokens": 100,
  "completionTokens": 50
}
```

## Exemplos de Uso

### JavaScript/Fetch
```javascript
// Chat simples
const response = await fetch('/api/chat/simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    modelId: 'openai/gpt-3.5-turbo',
    message: 'Olá!'
  })
});

const data = await response.json();
console.log(data.response);
```

### cURL
```bash
# Chat simples
curl -X POST http://localhost:3000/api/chat/simple \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "openai/gpt-3.5-turbo",
    "message": "Olá, como você está?"
  }'

# Listar seus modelos
curl http://localhost:3000/api/models/list

# Buscar modelos gratuitos
curl http://localhost:3000/api/models/free
```

### Python
```python
import requests

# Chat simples
response = requests.post('http://localhost:3000/api/chat/simple', 
  json={
    'modelId': 'openai/gpt-3.5-turbo',
    'message': 'Explique Python em uma frase'
  }
)

data = response.json()
print(data['response'])
```

## Configuração

Lembre-se de configurar sua `OPENROUTER_API_KEY` no arquivo `.env`:

```bash
OPENROUTER_API_KEY=sua_chave_aqui
```

## IDs de Modelos Populares

### Gratuitos
- `cognitivecomputations/dolphin-mistral-24b-venice-edition:free`
- `google/gemma-3n-e2b-it:free`
- `tngtech/deepseek-r1t2-chimera:free`
- `mistralai/mistral-small-3.2-24b-instruct:free`

### Pagos (Melhores)
- `openai/gpt-3.5-turbo`
- `openai/gpt-4`
- `anthropic/claude-3-sonnet`
- `anthropic/claude-3-opus`

Use `/api/models/list` para ver os modelos que você configurou como disponíveis.
