# TCC Backend

Backend desenvolvido em Node.js com TypeScript para o projeto de TCC, com integração completa ao OpenRouter para comunicação com diversos modelos de LLM.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista
- **Axios** - Cliente HTTP para requisições
- **OpenRouter** - API para acesso a múltiplos modelos LLM
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
├── tests/           # Testes unitários e de integração
├── app.ts           # Configuração do Express
└── server.ts        # Inicialização do servidor
```

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

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

Para executar com coverage:

```bash
npm run test -- --coverage
```

## 📈 Próximos Passos

- [ ] Integração com banco de dados (MongoDB/PostgreSQL)
- [ ] Autenticação JWT
- [ ] Validação com Joi ou Yup
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Documentação com Swagger
- [ ] Docker e Docker Compose
- [ ] Pipeline CI/CD

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
