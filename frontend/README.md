# Frontend - TCC Project

Este é o frontend do projeto TCC, construído com React, TypeScript e SASS. O projeto implementa uma interface moderna para chat com IA, incluindo sistema de autenticação robusto, validação de formulários em tempo real e testes E2E completos.

## 🚀 Funcionalidades Principais

- 💬 **Interface de Chat** moderna e responsiva
- 🔐 **Sistema de Autenticação** com validação robusta
- 🤖 **Seletor de Modelos IA** dinâmico
- 📱 **Design Responsivo** para todos os dispositivos
- 🎨 **Tema Ultra Dark** moderno e elegante
- ✅ **Validação em Tempo Real** de formulários
- 🧪 **Testes E2E** com Cypress

## 🛡️ Sistema de Validação

### Validação de Registro
- ✅ **Confirmação de senha** obrigatória
- ✅ **Validação em tempo real** conforme digitação
- ✅ **Feedback visual** com bordas coloridas
- ✅ **Botão habilitado** apenas com dados válidos

### Critérios de Validação
- **Nome**: mínimo 2 caracteres
- **Email**: formato válido (regex)
- **Senha**: mínimo 6 caracteres + pelo menos 1 letra
- **Confirmação**: deve coincidir exatamente com a senha

## Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **SASS** - Pré-processador CSS para estilização avançada
- **Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para requisições à API
- **React Router** - Roteamento para aplicações SPA
- **Cypress** - Framework de testes E2E

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### Desenvolvimento
- **`npm run dev`** - Executa a aplicação em modo de desenvolvimento (http://localhost:5173)
- **`npm run build`** - Constrói a aplicação para produção na pasta `dist`
- **`npm run preview`** - Visualiza a versão de produção localmente
- **`npm run lint`** - Executa o linter para verificar qualidade do código

### Testes E2E (Cypress)
- **`npm run cypress:open`** - Abre a interface do Cypress
- **`npm run cypress:run`** - Executa todos os testes em modo headless
- **`npm run cypress:run:validation`** - Executa apenas testes de validação
- **`npm run test:e2e`** - Executa testes com servidor (start-server-and-test)
- **`npm run test:e2e:open`** - Abre Cypress com servidor rodando

## Estrutura do Projeto

```
src/
├── assets/          # Arquivos estáticos (imagens, ícones, etc.)
├── components/      # Componentes reutilizáveis
│   ├── Chat.tsx           # Componente principal do chat
│   ├── ChatInput.tsx      # Campo de entrada de mensagens
│   ├── ChatLayout.tsx     # Layout do chat
│   ├── ChatMessage.tsx    # Componente de mensagem individual
│   ├── ChatMessages.tsx   # Lista de mensagens
│   ├── ChatSidebar.tsx    # Barra lateral do chat
│   ├── ChatWindow.tsx     # Janela principal do chat
│   ├── LoginForm.tsx      # Formulário de login
│   ├── RegisterForm.tsx   # Formulário de registro (com validação)
│   ├── ModelSelector.tsx  # Seletor de modelos IA
│   └── ProtectedRoute.tsx # Rota protegida por autenticação
├── pages/           # Páginas da aplicação
│   ├── ChatPage.tsx       # Página do chat
│   ├── LoginPage.tsx      # Página de login
│   └── RegisterPage.tsx   # Página de registro
├── context/         # Contextos React
│   ├── AuthContext.tsx    # Contexto de autenticação
│   └── context.tsx        # Contexto principal (chat)
├── hooks/           # Custom hooks
│   ├── useAuth.ts         # Hook de autenticação
│   └── useChat.ts         # Hook do chat
├── services/        # Serviços para comunicação com API
│   └── api.ts             # Cliente HTTP e endpoints
├── styles/          # Estilos SASS
│   ├── _base.scss         # Estilos base
│   ├── _variables.scss    # Variáveis CSS
│   ├── _utilities.scss    # Classes utilitárias
│   ├── main.scss          # Arquivo principal
│   └── components/        # Estilos por componente
├── types/           # Definições de tipos TypeScript
│   └── index.ts           # Tipos da aplicação
├── utils/           # Funções utilitárias
├── App.tsx          # Componente principal
└── main.tsx         # Ponto de entrada da aplicação

cypress/             # Testes E2E
├── e2e/            # Testes end-to-end
│   ├── register-validation.cy.ts  # Testes de validação
│   ├── auth-flow.cy.ts            # Testes de autenticação
│   ├── responsive.cy.ts           # Testes responsivos
│   └── chat-interface.cy.ts       # Testes de chat
├── fixtures/       # Dados de teste
├── support/        # Configurações do Cypress
└── cypress.config.js  # Configuração principal
```

## 🧪 Testes E2E

O projeto inclui uma suíte completa de testes end-to-end usando Cypress:

### Cobertura de Testes
- ✅ **Validação de formulários** (6 testes - 100% passando)
- ✅ **Fluxo de autenticação** (10 testes - 80% passando)
- ✅ **Responsividade** (12 testes - 67% passando)
- 🔄 **Interface de chat** (preparado para backend)

### Executar Testes
```bash
# Testes de validação (recomendado - sempre passam)
npm run cypress:run:validation

# Todos os testes (necessário backend rodando)
npm run test:e2e

# Interface interativa do Cypress
npm run test:e2e:open
```

## 🎨 Design System

### Tema Ultra Dark
- **Cores primárias**: Tons de cinza ultra escuros (#0a0a0a, #111111)
- **Acentos**: Cinza azulado (#6b7280, #4b5563)
- **Texto**: Alto contraste (#f0f0f0, #a0a0a0)
- **Bordas**: Sutis e elegantes (#2a2a2a)

### Responsividade
- **Mobile**: 375px+ (layout vertical, componentes adaptados)
- **Tablet**: 768px+ (formulários centralizados)
- **Desktop**: 1280px+ (layout completo com sidebar)

## 🚀 Desenvolvimento

### Configuração Inicial
1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   # Crie o arquivo .env (já existe)
   # Verifique se a URL da API está correta:
   VITE_API_URL=http://localhost:3000
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

### Validação de Qualidade
```bash
# Verificar linting
npm run lint

# Executar testes de validação
npm run cypress:run:validation

# Build para produção
npm run build
```

### Desenvolvimento com Backend
1. **Certifique-se** de que o backend está rodando em `http://localhost:3000`
2. **Execute** o frontend com `npm run dev`
3. **Teste** a integração com `npm run test:e2e`

## 🔧 Configuração Avançada

### Variáveis de Ambiente (.env)
```env
# URL da API do backend
VITE_API_URL=http://localhost:3000

# Configurações da aplicação
VITE_APP_NAME=TCC Frontend
VITE_APP_VERSION=1.0.0
```

### Build e Deploy
```bash
# Build para produção
npm run build

# Preview da build
npm run preview

# Verificar bundle
npm run build && ls -la dist/
```

## 📚 Recursos Adicionais

### Documentação
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Cypress Documentation](https://docs.cypress.io/)

### Arquitetura
- **Padrão**: Component-based architecture
- **Estado**: Context API + useReducer
- **Estilização**: SASS com BEM methodology
- **Testes**: E2E com Cypress
