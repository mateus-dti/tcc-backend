# TCC Backend

Backend desenvolvido em Node.js com TypeScript para o projeto de TCC, com integração completa ao OpenRouter para comunicação com diversos modelos de LLM.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista
- **Axios** - Cliente HTTP para requisições
- **OpenRouter** - API para acesso a múltiplos modelos LLM
- **Redis** - Banco de dados em memória para sessões e cache
- **Docker** - Containerização para Redis e Redis Commander
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **Helmet** - Middleware de segurança
- **Morgan** - Logger HTTP
- **ESLint** - Linter para código JavaScript/TypeScript
- **Jest** - Framework de testes

## 📦 Instalação

1. **Clone o repositório ou navegue até a pasta do projeto**

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações, especialmente:
   - `OPENROUTER_API_KEY`: Sua chave API do OpenRouter (obtenha em https://openrouter.ai/keys)
   - `APP_NAME`: Nome da sua aplicação
   - `HTTP_REFERER`: URL do seu frontend
   - `REDIS_PASSWORD`: Senha do Redis (padrão: `tcc_redis_2025`)

4. **Configure o Redis com Docker:**
   ```bash
   # Iniciar containers Redis e Redis Commander
   docker-compose up -d
   
   # Verificar se os containers estão rodando
   docker-compose ps
   
   # Acessar Redis Commander em: http://localhost:8081
   ```

## 🏃‍♂️ Como executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Testes
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📋 Estrutura do Projeto

```
src/
├── controllers/     # Controladores (lógica de requisição/resposta)
├── services/        # Serviços (lógica de negócio)
├── models/          # Modelos de dados (interfaces/types)
├── routes/          # Definição das rotas
├── middleware/      # Middlewares customizados
├── config/          # Configurações (Redis, database, etc.)
├── tests/           # Testes unitários e de integração
├── app.ts           # Configuração do Express
└── server.ts        # Inicialização do servidor
```

## 🗃️ Sistema de Sessões com Redis

Este projeto inclui um sistema completo de controle de sessões para gerenciar conversas com contexto usando Redis como armazenamento.

### Funcionalidades
- ✅ **Criação de sessões** com IDs únicos
- ✅ **Controle por usuário** - múltiplas sessões por usuário
- ✅ **Histórico de mensagens** persistente
- ✅ **TTL automático** - sessões expiram em 7 dias
- ✅ **Limitação de sessões** - máximo 10 sessões por usuário
- ✅ **Redis Commander** - interface visual para monitoramento

### Infraestrutura
- **Redis 7-alpine** - Armazenamento principal
- **Redis Commander** - Interface web (http://localhost:8081)
- **Docker Compose** - Orquestração de containers
- **Autenticação** - Redis protegido com senha

### Documentação
Consulte o arquivo [SESSIONS_README.md](./SESSIONS_README.md) para documentação completa do sistema de sessões.

## 🤖 Integração OpenRouter

Este backend inclui integração completa com a [OpenRouter API](https://openrouter.ai) para comunicação com diversos modelos de LLM (GPT-4, Claude, Llama, etc.).

### Funcionalidades
- ✅ Acesso a 150+ modelos LLM diferentes
- ✅ Filtragem de modelos por preço, contexto e capacidades
- ✅ Conversas com contexto mantido
- ✅ Cálculo de custos estimados
- ✅ Rate limiting e validação
- ✅ Tratamento robusto de erros

### Documentação
Consulte o arquivo [OPENROUTER_DOCS.md](./OPENROUTER_DOCS.md) para documentação completa da API de chat.

## 🔗 Endpoints

### Health Check
- `GET /health` - Verifica se o servidor está funcionando

### API Base
- `GET /api` - Informações da API

### Usuários
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca usuário por ID
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

### Chat/LLM (OpenRouter)
- `GET /api/chat/models` - Lista modelos LLM disponíveis
- `GET /api/chat/models/filtered` - Filtra modelos por critérios
- `POST /api/chat/message` - Envia mensagem simples
- `POST /api/chat/conversation` - Conversa com contexto
- `POST /api/chat/complete` - Chat completion completo
- `POST /api/chat/cost-estimate` - Calcula custo estimado
- `GET /api/chat/health` - Verifica status da API OpenRouter

### Sessões (Redis)
- `GET /api/sessions/health` - Verifica status do Redis
- `POST /api/sessions` - Cria nova sessão de chat
- `GET /api/sessions/:id` - Busca sessão por ID
- `POST /api/sessions/:id/messages` - Adiciona mensagem à sessão
- `GET /api/sessions/:id/messages` - Lista mensagens da sessão
- `GET /api/users/:userId/sessions` - Lista sessões do usuário
- `DELETE /api/sessions/:id` - Remove sessão

## 📝 Exemplo de Uso

### Criar um usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'
```

### Listar usuários
```bash
curl http://localhost:3000/api/users
```

### Enviar mensagem para LLM
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "message": "Explique machine learning em termos simples",
    "systemPrompt": "Você é um professor didático"
  }'
```

### Listar modelos LLM disponíveis
```bash
curl http://localhost:3000/api/chat/models
```

### Criar uma sessão de chat
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Minha conversa sobre IA"
  }'
```

### Adicionar mensagem à sessão
```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Explique machine learning",
    "role": "user"
  }'
```

### Listar sessões do usuário
```bash
curl http://localhost:3000/api/users/user123/sessions
```

### Buscar histórico de mensagens
```bash
curl http://localhost:3000/api/sessions/SESSION_ID/messages
```

## 🛡️ Segurança

O projeto inclui várias medidas de segurança:

- **Helmet** - Define vários cabeçalhos HTTP para segurança
- **CORS** - Configurado para permitir apenas origens específicas
- **Validação de entrada** - Validação básica nos controllers
- **Error handling** - Tratamento centralizado de erros

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do servidor | `3000` |
| `CORS_ORIGIN` | Origem permitida para CORS | `http://localhost:3000` |
| `JWT_SECRET` | Chave secreta para JWT | - |
| `DATABASE_URL` | URL de conexão com banco | - |
| `OPENROUTER_API_KEY` | Chave API do OpenRouter | - |
| `APP_NAME` | Nome da aplicação | `TCC Backend` |
| `HTTP_REFERER` | URL de referência | `http://localhost:3000` |
| `REDIS_HOST` | Host do Redis | `localhost` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `REDIS_PASSWORD` | Senha do Redis | `tcc_redis_2025` |
| `REDIS_DB` | Database do Redis | `0` |

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

Para executar com coverage:

```bash
npm run test -- --coverage
```

## 🐳 Docker e Redis

### Comandos principais

```bash
# Iniciar Redis e Redis Commander
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs do Redis
docker-compose logs redis

# Reiniciar containers
docker-compose restart

# Executar comando no Redis
docker exec tcc-redis redis-cli -a "tcc_redis_2025" ping
```

### Acessos
- **Redis**: `localhost:6379` (password: `tcc_redis_2025`)
- **Redis Commander**: http://localhost:8081

## 📈 Próximos Passos

- [x] ~~Integração com banco de dados~~ **Redis implementado**
- [x] ~~Docker e Docker Compose~~ **Implementado para Redis**
- [ ] Autenticação JWT
- [ ] Validação com Joi ou Yup
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Documentação com Swagger
- [ ] Integração chat + sessões
- [ ] Pipeline CI/CD

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
