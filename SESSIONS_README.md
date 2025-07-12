# 🚀 Sistema de Sessões de Chat com Redis

Este documento descreve a implementação do sistema de sessões de chat usando Redis para controle de contexto das conversas.

## 📋 Visão Geral

O sistema permite:
- ✅ Criar sessões de chat isoladas por usuário
- ✅ Manter contexto de conversas com TTL automático
- ✅ Controlar limite de sessões por usuário
- ✅ Gerenciar histórico de mensagens
- ✅ Expiração automática de dados antigos
- ✅ Interface visual para monitoramento (Redis Commander)

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Node.js API   │───▶│     Redis       │
│   (Client)      │    │   (Express)     │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │   OpenRouter    │
                        │   (AI Models)   │
                        └─────────────────┘
```

## 🔧 Configuração Rápida

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- PowerShell (Windows) ou Bash (Linux/macOS)

### Setup Automático (Windows)
```powershell
.\setup.ps1
```

### Setup Automático (Linux/macOS)
```bash
chmod +x setup.sh
./setup.sh
```

### Setup Manual
1. **Copiar arquivo de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Configurar variáveis (editar .env):**
   ```env
   REDIS_PASSWORD=sua_senha_redis_aqui
   OPENROUTER_API_KEY=sua_chave_openrouter_aqui
   ```

3. **Iniciar serviços:**
   ```bash
   docker-compose up -d
   npm install
   npm run dev
   ```

## 🐳 Serviços Docker

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Redis | 6379 | Banco de dados para sessões |
| Redis Commander | 8081 | Interface web para Redis |

### Comandos Docker
```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f redis

# Acessar console Redis
docker exec -it tcc-redis redis-cli -a sua_senha
```

## 📊 Estrutura de Dados Redis

### Padrões de Chaves
```
session:{sessionId}              # Hash: dados da sessão
user:{userId}:sessions           # List: sessões do usuário
session:{sessionId}:messages     # List: mensagens da sessão
message:{messageId}              # Hash: dados da mensagem
```

### Exemplo de Sessão
```redis
# Dados da sessão
HSET session:uuid-123 id "uuid-123" userId "user456" title "Chat sobre IA"

# Lista de mensagens
LPUSH session:uuid-123:messages "msg-001" "msg-002"

# Dados da mensagem
HSET message:msg-001 role "user" content "Olá!" timestamp "2025-01-01T10:00:00Z"
```

## 🔌 API Endpoints

### Gerenciamento de Sessões

#### Criar Sessão
```http
POST /api/sessions
Content-Type: application/json

{
  "userId": "user123",
  "title": "Nova Conversa",
  "model": "openai/gpt-3.5-turbo"
}
```

#### Buscar Sessão
```http
GET /api/sessions/{sessionId}
```

#### Listar Sessões do Usuário
```http
GET /api/users/{userId}/sessions
```

#### Deletar Sessão
```http
DELETE /api/sessions/{sessionId}
```

### Chat com Sessões

#### Iniciar Chat com Sessão
```http
POST /api/chat/session/start
Content-Type: application/json

{
  "userId": "user123",
  "title": "Conversa sobre IA",
  "modelId": "openai/gpt-4",
  "initialMessage": "Explique machine learning"
}
```

#### Enviar Mensagem na Sessão
```http
POST /api/chat/session
Content-Type: application/json

{
  "sessionId": "uuid-123",
  "message": "Continue explicando...",
  "modelId": "openai/gpt-4"
}
```

#### Buscar Histórico da Sessão
```http
GET /api/chat/session/{sessionId}/history?limit=20&offset=0
```

### Mensagens em Sessões

#### Adicionar Mensagem
```http
POST /api/sessions/{sessionId}/messages
Content-Type: application/json

{
  "role": "user",
  "content": "Mensagem do usuário",
  "model": "openai/gpt-3.5-turbo"
}
```

#### Buscar Mensagens
```http
GET /api/sessions/{sessionId}/messages?limit=50&offset=0
```

## ⚙️ Configurações

### Variáveis de Ambiente
```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=senha_segura
REDIS_DB=0

# Sessões
SESSION_TTL=3600                    # TTL em segundos (1 hora)
MAX_SESSIONS_PER_USER=5             # Máximo de sessões por usuário
MAX_MESSAGES_PER_SESSION=100        # Máximo de mensagens por sessão
MAX_MESSAGE_LENGTH=4000             # Tamanho máximo da mensagem

# OpenRouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### Configuração Redis (redis/redis.conf)
```redis
# Memória
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistência
save 900 1
appendonly yes

# Segurança
requirepass sua_senha_aqui
protected-mode yes
```

## 🔍 Monitoramento

### Redis Commander
Acesse http://localhost:8081 para:
- Visualizar todas as chaves
- Monitorar uso de memória
- Executar comandos Redis
- Debug de dados

### Health Checks
```http
GET /health                    # Saúde geral da API
GET /api/sessions/health       # Saúde do serviço de sessões
```

### Comandos Redis Úteis
```redis
# Estatísticas
INFO memory
INFO stats

# Listar todas as sessões
KEYS session:*

# Contar sessões ativas
EVAL "return #redis.call('keys', 'session:*')" 0

# Ver expiração de chave
TTL session:uuid-123
```

## 🚀 Uso em Desenvolvimento

### Iniciar Desenvolvimento
```bash
# Terminal 1: Serviços
docker-compose up -d

# Terminal 2: API
npm run dev

# Terminal 3: Monitoramento (opcional)
docker-compose logs -f redis
```

### Testar API
```bash
# Criar sessão
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","title":"Teste"}'

# Enviar mensagem
curl -X POST http://localhost:3000/api/chat/session \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"uuid-aqui","message":"Olá!"}'
```

## 📈 Performance e Limites

### Configurações Padrão
- **TTL da Sessão**: 1 hora (3600s)
- **Sessões por Usuário**: 5 máximo
- **Mensagens por Sessão**: 100 máximo
- **Tamanho da Mensagem**: 4000 caracteres máximo

### Otimizações
- Todas as chaves têm TTL automático
- Listas são limitadas automaticamente
- Operações O(1) para acesso a dados
- Memória limitada com política LRU

## 🐛 Troubleshooting

### Redis não conecta
```bash
# Verificar se está rodando
docker ps | grep redis

# Verificar logs
docker logs tcc-redis

# Testar conexão
docker exec tcc-redis redis-cli ping
```

### Problemas de Memória
```redis
# Ver uso de memória
INFO memory

# Limpar todas as chaves (CUIDADO!)
FLUSHALL
```

### Sessões não expiram
```redis
# Verificar TTL
TTL session:uuid-123

# Definir TTL manualmente
EXPIRE session:uuid-123 3600
```

## 📚 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar webhook para notificações
- [ ] Criar dashboard de analytics
- [ ] Implementar rate limiting por usuário
- [ ] Adicionar backup automático do Redis
- [ ] Implementar clustering Redis para HA

---

## 🤝 Contribuição

Este sistema foi desenvolvido como parte do TCC e está em constante evolução. Sugestões e melhorias são bem-vindas!
