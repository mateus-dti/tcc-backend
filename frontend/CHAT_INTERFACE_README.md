# Interface de Chat Moderna - Frontend

Uma interface de chat moderna inspirada no ChatGPT, desenvolvida com React, TypeScript e Sass, com tema escuro e design responsivo.

## ✨ Características

- **Tema Escuro Moderno**: Interface inspirada no GitHub e ChatGPT
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Componentes Modulares**: Arquitetura bem organizada
- **TypeScript**: Tipagem forte para melhor desenvolvimento
- **Sass**: Estilização avançada com variáveis e mixins
- **Estado Global**: Gerenciamento com Context API
- **Animações Suaves**: Transições e feedbacks visuais

## 🎨 Design System

### Cores (Tema Escuro)
- **Background Principal**: `#0d1117` (GitHub dark)
- **Background Secundário**: `#161b22`
- **Background Terciário**: `#21262d`
- **Texto Principal**: `#e6edf3`
- **Texto Secundário**: `#8b949e`
- **Accent Primary**: `#58a6ff` (Azul)
- **Success**: `#2ea043` (Verde)

### Componentes

#### 1. ChatLayout
- Layout principal com sidebar e janela de chat
- Sidebar fixa de 260px no desktop
- Responsivo para mobile com menu hambúrguer

#### 2. ChatSidebar
- Lista de conversas
- Botão "Nova conversa"
- Informações do usuário
- Totalmente responsiva

#### 3. ChatWindow
- Área principal de mensagens
- Header com título e contador
- Input de mensagem na parte inferior

#### 4. ChatMessages
- Renderização de mensagens
- Auto-scroll para novas mensagens
- Tela de boas-vindas quando vazio
- Indicador de digitação

#### 5. ChatInput
- Textarea que cresce automaticamente
- Botão de envio com estados
- Suporte a Shift+Enter para nova linha
- Desabilitado durante carregamento

## 🛠️ Tecnologias

- **React 19.1.0**
- **TypeScript 5.8.3**
- **Sass 1.89.2**
- **Vite 7.0.4**
- **Axios 1.10.0** (para API calls)

## 📁 Estrutura de Arquivos

```
src/
├── components/           # Componentes React
│   ├── Chat.tsx         # Componente principal
│   ├── ChatLayout.tsx   # Layout principal
│   ├── ChatSidebar.tsx  # Barra lateral
│   ├── ChatWindow.tsx   # Janela de chat
│   ├── ChatMessages.tsx # Lista de mensagens
│   ├── ChatMessage.tsx  # Mensagem individual
│   ├── ChatInput.tsx    # Input de mensagem
│   └── index.ts         # Exports dos componentes
├── hooks/               # Custom hooks
│   └── useChat.ts       # Hook para gerenciar chat
├── styles/              # Estilos Sass
│   ├── main.scss        # Arquivo principal
│   ├── _variables.scss  # Variáveis CSS
│   ├── _base.scss       # Estilos base
│   ├── _utilities.scss  # Utilitários
│   └── components/      # Estilos dos componentes
│       ├── _chat-layout.scss
│       ├── _chat-messages.scss
│       ├── _chat-input.scss
│       └── _responsive.scss
├── context.tsx          # Context API para estado global
└── types/               # Definições de tipos TypeScript
```

## 🚀 Como Usar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar**: http://localhost:5173

## 🎯 Próximos Passos

- [ ] Conectar com backend via API
- [ ] Implementar autenticação
- [ ] Adicionar suporte a markdown nas mensagens
- [ ] Implementar upload de arquivos
- [ ] Adicionar temas customizáveis
- [ ] Implementar busca nas conversas
- [ ] Adicionar notificações
- [ ] Implementar PWA

## 📱 Responsividade

A interface é totalmente responsiva:

- **Desktop (>1024px)**: Layout completo com sidebar visível
- **Tablet (768px-1024px)**: Layout adaptado
- **Mobile (<768px)**: Sidebar em overlay, foco na conversa

## 🎨 Customização

As variáveis CSS estão centralizadas em `_variables.scss`, permitindo fácil customização:

```scss
:root {
  --color-bg-primary: #0d1117;
  --color-text-primary: #e6edf3;
  --color-accent-primary: #58a6ff;
  // ... outras variáveis
}
```

## 🧪 Estado da Aplicação

O estado é gerenciado com Context API e inclui:

- Lista de mensagens
- Status de carregamento
- Input atual
- Funções para adicionar mensagens, limpar chat, etc.

## 💬 Simulação de Chat

Atualmente, a aplicação simula respostas da IA. Para conectar com uma API real:

1. Edite `ChatInput.tsx`
2. Substitua a simulação por uma chamada real à API
3. Use o `OpenRouterService` do backend para integração
