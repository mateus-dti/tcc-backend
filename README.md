# TCC Project - Sistema de Chat com IA

Este é um projeto completo de TCC que implementa um sistema de chat integrado com múltiplos modelos de IA através da API OpenRouter. O projeto é composto por um backend em Node.js/TypeScript e um frontend em React/TypeScript.

## 📋 Visão Geral

O sistema permite que usuários interajam com diferentes modelos de IA (GPT, Claude, Llama, etc.) através de uma interface web moderna. As conversas são organizadas em sessões persistentes, permitindo continuidade nas interações.

### Principais Funcionalidades

- 💬 **Chat em tempo real** com múltiplos modelos de IA
- 📝 **Gerenciamento de sessões** para organizar conversas
- 👤 **Sistema de usuários** para personalização
- 🤖 **Múltiplos modelos** disponíveis via OpenRouter
- 💾 **Persistência de dados** com Redis
- 🔒 **Segurança** com middlewares de proteção

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │ ←─────────────────→ │                 │
│    Frontend     │                     │     Backend     │
│   (React TS)    │                     │   (Node.js TS)  │
│                 │                     │                 │
└─────────────────┘                     └─────────────────┘
                                                 │
                                                 │ Redis Client
                                                 ▼
                                        ┌─────────────────┐
                                        │      Redis      │
                                        │   (Database)    │
                                        └─────────────────┘
                                                 ▲
                                                 │ HTTP API
                                                 ▼
                                        ┌─────────────────┐
                                        │   OpenRouter    │
                                        │   (IA Models)   │
                                        └─────────────────┘
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express.js** - Framework web minimalista e rápido
- **Redis** - Banco de dados em memória para sessões e cache
- **Axios** - Cliente HTTP para requisições à API OpenRouter
- **Docker** - Containerização do Redis
- **Jest** - Framework de testes
- **ESLint** - Linter para qualidade de código

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **SASS** - Pré-processador CSS
- **Axios** - Cliente HTTP para comunicação com a API
- **React Router** - Roteamento SPA

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker e Docker Compose
- Conta no OpenRouter (para chave da API)

### 1. Configuração do Backend

```bash
# Navegue para a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o Redis com Docker
docker-compose up -d

# Execute o backend em modo desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3000`

### 2. Configuração do Frontend

```bash
# Em um novo terminal, navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute o frontend em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 3. Configuração das Variáveis de Ambiente

#### Backend (.env)
```env
# Porta do servidor
PORT=3000

# Configuração do Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# Configurações de CORS
FRONTEND_URL=http://localhost:5173
```

## 📁 Estrutura do Projeto

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/         # Controladores da API
│   │   ├── ChatController.ts
│   │   ├── ModelController.ts
│   │   ├── SessionController.ts
│   │   └── UserController.ts
│   ├── services/           # Lógica de negócio
│   │   ├── OpenRouterService.ts
│   │   ├── SessionService.ts
│   │   ├── ModelManagerService.ts
│   │   └── UserService.ts
│   ├── routes/             # Definição das rotas
│   ├── middleware/         # Middlewares personalizados
│   ├── models/             # Modelos de dados
│   ├── config/             # Configurações
│   └── tests/              # Testes unitários
├── data/                   # Dados estáticos
├── examples/               # Exemplos de uso
└── redis/                  # Configurações do Redis
```

#### Principais Endpoints da API

- `GET /api/models` - Lista modelos disponíveis
- `POST /api/users` - Cria/autentica usuário
- `GET /api/sessions` - Lista sessões do usuário
- `POST /api/sessions` - Cria nova sessão
- `POST /api/chat` - Envia mensagem para IA
- `GET /api/chat/history/:sessionId` - Histórico da sessão

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços de API
│   ├── types/              # Definições de tipos TypeScript
│   ├── styles/             # Estilos SASS
│   │   ├── components/     # Estilos de componentes
│   │   └── pages/          # Estilos de páginas
│   └── utils/              # Utilitários
└── public/                 # Arquivos públicos
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Compila o TypeScript
npm run start        # Inicia a versão compilada
npm test             # Executa os testes
npm run lint         # Verifica qualidade do código
```

### Frontend
```bash
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza build de produção
npm run lint         # Verifica qualidade do código
```

## 🧪 Testes

O projeto inclui testes unitários para o backend:

```bash
cd backend
npm test
```

## 🐳 Docker

O projeto utiliza Docker para o Redis. Para gerenciar os containers:

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs redis

# Acessar Redis Commander (interface web)
# Disponível em http://localhost:8081
```

## 📚 Documentação Adicional

- [Documentação da API OpenRouter](backend/OPENROUTER_DOCS.md)
- [Documentação da API do Chat](backend/CHAT_API_DOCS.md)
- [Gerenciamento de Sessões](backend/SESSIONS_README.md)
- [Configuração SASS](frontend/SASS_README.md)

## 🔒 Segurança

O projeto implementa várias camadas de segurança:

- **Helmet** - Proteção de cabeçalhos HTTP
- **CORS** - Configuração restritiva de origens
- **Rate Limiting** - Prevenção de spam
- **Validação de entrada** - Sanitização de dados
- **Autenticação JWT** - Tokens seguros (se implementado)

## 🚀 Deploy

### Backend
1. Configure as variáveis de ambiente de produção
2. Execute `npm run build`
3. Deploy da pasta `dist/` em seu servidor
4. Configure Redis em produção

### Frontend
1. Configure a URL da API de produção
2. Execute `npm run build`
3. Deploy da pasta `dist/` em um servidor web estático

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Mateus** - Desenvolvedor Principal

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação específica de cada módulo
2. Consulte os logs de erro no terminal
3. Abra uma issue no repositório

---

**Nota**: Este é um projeto acadêmico (TCC) desenvolvido para demonstrar integração com APIs de IA e desenvolvimento full-stack moderno.
