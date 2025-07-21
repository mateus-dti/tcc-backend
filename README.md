# TCC Project - Sistema de Chat com IA

Este é um projeto completo de TCC que implementa um sistema de chat integrado com múltiplos modelos de IA através da API OpenRouter. O projeto é composto por um backend em Node.js/TypeScript e um frontend em React/TypeScript.

## 📋 Visão Geral

O sistema permite que usuários interajam com diferentes modelos de IA (GPT, Claude, Llama, etc.) através de uma interface web moderna. As conversas são organizadas em sessões persistentes, permitindo continuidade nas interações.

### Principais Funcionalidades

- 💬 **Chat em tempo real** com múltiplos modelos de IA
- 🤖 **Seletor de modelo dinâmico** para escolher o modelo de IA durante a conversa
- 📝 **Gerenciamento de sessões** para organizar conversas
- 👤 **Sistema de usuários** com autenticação segura
- 🔐 **Validação robusta** de formulários com feedback em tempo real
- 🤖 **Múltiplos modelos** disponíveis via OpenRouter
- 💾 **Persistência de dados** com Redis
- 🔒 **Segurança** com middlewares de proteção
- 🎨 **Interface moderna** com tema ultra dark e design responsivo
- 📱 **Design responsivo** para mobile, tablet e desktop
- ✅ **Testes E2E** com Cypress para garantia de qualidade

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
- **Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para comunicação com a API
- **React Router** - Roteamento SPA

## ✨ Funcionalidades Especiais

### 🔄 Seletor de Modelo Dinâmico

O sistema inclui um seletor de modelo integrado à interface de chat que permite:

- **Troca de modelo em tempo real** durante a conversa
- **Interface compacta** integrada ao campo de input
- **Modelos disponíveis**:
  - Venice: Uncensored
  - Gemma 3N 2B
  - DeepSeek R1T2 Chimera
  - Cypher Alpha
  - Mistral Small 3.2 24B Instruct
  - Kimi Dev 72B
- **Design harmonioso** com cores que seguem o tema do projeto
- **Responsividade** para diferentes tamanhos de tela

O seletor é posicionado abaixo da caixa de texto principal e permite que o usuário escolha qual modelo de IA utilizará para sua próxima consulta, oferecendo flexibilidade na experiência de uso.

### 🔧 Gerenciamento de Estado

O projeto utiliza **React Context API** para gerenciamento de estado global, incluindo:

- **Estado das mensagens** do chat
- **Modelo selecionado** atualmente
- **Lista de modelos disponíveis**
- **Estado de carregamento** da aplicação
- **Input atual** do usuário

O contexto é implementado com `useReducer` para garantir atualizações de estado previsíveis e facilitar o debug.

### 🛡️ Sistema de Validação e Autenticação

O projeto implementa um sistema robusto de validação e autenticação:

#### 🔐 Validação de Formulários
- **Validação em tempo real** para todos os campos
- **Validação de confirmação de senha** com feedback visual
- **Verificação de força da senha**:
  - Mínimo 6 caracteres
  - Pelo menos uma letra
- **Validação de email** com regex
- **Feedback visual** com bordas coloridas e mensagens específicas
- **Botão de submit** habilitado apenas quando todos os campos são válidos

#### 📧 Validação de Dados
- **Nome**: mínimo 2 caracteres
- **Email**: formato válido obrigatório
- **Senha**: critérios de segurança
- **Confirmação de senha**: deve coincidir exatamente

#### 🎨 Interface de Autenticação
- **Design consistente** com o tema ultra dark
- **Layout responsivo** para todos os dispositivos
- **Estados visuais** claros (loading, error, success)
- **Altura fixa** sem scroll vertical desnecessário

### ✅ Testes End-to-End (E2E)

O projeto inclui uma suíte completa de testes E2E usando **Cypress**:

#### 🧪 Cobertura de Testes
- **Validação de formulários**: 6 testes (100% passando)
- **Fluxo de autenticação**: 10 testes (80% passando*)
- **Responsividade**: 12 testes (67% passando*)
- **Interface do chat**: Testes preparados

*Alguns testes falham intencionalmente quando o backend não está rodando

#### 📱 Testes de Responsividade
- **Mobile** (375x667): Testes de layout e interação
- **Tablet** (768x1024): Adaptação de formulários
- **Desktop** (1280x720): Interface completa

#### 🔍 Comandos de Teste Disponíveis
```bash
# Executar apenas testes de validação
npm run cypress:run:validation

# Executar todos os testes E2E
npm run test:e2e

# Abrir interface do Cypress
npm run test:e2e:open
```

#### 📊 Estrutura de Testes
```
cypress/
├── e2e/
│   ├── register-validation.cy.ts    # Validação de formulários
│   ├── auth-flow.cy.ts              # Fluxo de autenticação
│   ├── responsive.cy.ts             # Testes responsivos
│   └── chat-interface.cy.ts         # Interface de chat
├── fixtures/                        # Dados de teste
├── support/                         # Configurações e comandos
└── cypress.config.js                # Configuração principal
```

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

### 3. Executar Testes (Opcional)

```bash
# No diretório do frontend
cd frontend

# Executar testes de validação (recomendado)
npm run cypress:run:validation

# Executar todos os testes E2E (com servidor rodando)
npm run test:e2e

# Abrir interface do Cypress para testes interativos
npm run test:e2e:open
```

### 4. Configuração das Variáveis de Ambiente

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
│   │   ├── Chat.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatLayout.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ModelSelector.tsx  # Seletor de modelo de IA
│   │   └── index.ts
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   │   └── useChat.ts      # Hook para gerenciamento do chat
│   ├── services/           # Serviços de API
│   ├── types/              # Definições de tipos TypeScript
│   ├── styles/             # Estilos SASS
│   │   ├── components/     # Estilos de componentes
│   │   │   ├── _model-selector.scss  # Estilos do seletor
│   │   │   └── ...
│   │   └── pages/          # Estilos de páginas
│   ├── context.tsx         # Context API para estado global
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
- [Interface do Chat](frontend/CHAT_INTERFACE_README.md)

## 🔒 Segurança

O projeto implementa várias camadas de segurança:

- **Helmet** - Proteção de cabeçalhos HTTP
- **CORS** - Configuração restritiva de origens
- **Rate Limiting** - Prevenção de spam
- **Validação de entrada** - Sanitização de dados
- **Autenticação JWT** - Tokens seguros (se implementado)

## 🎨 Design e UX

### Tema Ultra Dark
- **Paleta de cores escuras** para melhor experiência visual
- **Contraste otimizado** para leitura confortável
- **Componentes responsivos** para diferentes dispositivos

### Interface do Chat
- **Design minimalista** focado na experiência do usuário
- **Animações suaves** para feedback visual
- **Indicadores de estado** (digitando, carregando)
- **Seletor de modelo integrado** sem poluir a interface

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
