# 🧩 Componentes React

Este diretório contém todos os componentes React da aplicação, organizados de forma modular e reutilizável.

## 📁 Estrutura de Componentes

### 🔐 Autenticação
```
├── LoginForm.tsx      # Formulário de login
├── RegisterForm.tsx   # Formulário de registro com validação
└── ProtectedRoute.tsx # HOC para rotas protegidas
```

### 💬 Chat Interface
```
├── Chat.tsx           # Componente principal do chat
├── ChatInput.tsx      # Input para mensagens
├── ChatLayout.tsx     # Layout base do chat
├── ChatMessage.tsx    # Componente de mensagem individual
├── ChatMessages.tsx   # Container de mensagens
├── ChatSidebar.tsx    # Barra lateral com sessões
└── ChatWindow.tsx     # Janela principal do chat
```

### 🎛️ Interface
```
├── ModelSelector.tsx  # Seletor de modelos de IA
└── index.ts          # Barrel export de todos componentes
```

## 📋 Detalhamento dos Componentes

### 🔐 Componentes de Autenticação

#### `LoginForm.tsx`
**Propósito**: Formulário de autenticação de usuários
**Estados**: Loading, erro, sucesso
**Validação**: Email e senha obrigatórios

```typescript
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string;
}
```

**Funcionalidades**:
- ✅ Validação em tempo real
- ✅ Estados de loading
- ✅ Feedback de erro
- ✅ Navegação para registro

#### `RegisterForm.tsx` ⭐
**Propósito**: Registro de novos usuários com validação robusta
**Estados**: Validação, loading, confirmação
**Validação**: Nome, email, senha e confirmação

```typescript
interface RegisterFormProps {
  onSubmit: (userData: RegisterData) => void;
  loading?: boolean;
  error?: string;
}
```

**Funcionalidades Avançadas**:
- ✅ **Validação em tempo real** de todos os campos
- ✅ **Confirmação de senha** com feedback visual
- ✅ **Força da senha** (mínimo 6 caracteres)
- ✅ **Desabilitação inteligente** do botão submit
- ✅ **Feedback visual** com cores e ícones
- ✅ **Responsividade** completa

**Validações Implementadas**:
```typescript
const validateField = (name: string, value: string) => {
  switch (name) {
    case 'name': return value.trim().length >= 2
    case 'email': return /\S+@\S+\.\S+/.test(value)
    case 'password': return value.length >= 6
    case 'confirmPassword': return value === formData.password
  }
}
```

#### `ProtectedRoute.tsx`
**Propósito**: HOC para proteger rotas autenticadas
**Funcionalidade**: Redirecionamento automático para login

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

### 💬 Componentes de Chat

#### `Chat.tsx`
**Propósito**: Componente principal que orquestra toda interface
**Responsabilidades**: Gerenciamento de estado, layout, integração

```typescript
interface ChatProps {
  sessionId?: string;
  initialModel?: string;
}
```

#### `ChatInput.tsx`
**Propósito**: Input para digitação e envio de mensagens
**Funcionalidades**: 
- ✅ Textarea expansível
- ✅ Shortcut Ctrl+Enter
- ✅ Contador de caracteres
- ✅ Estados disabled

#### `ChatLayout.tsx`
**Propósito**: Layout responsivo com sidebar e área principal
**Breakpoints**:
- **Mobile**: Sidebar em overlay
- **Desktop**: Sidebar fixa lateral

#### `ChatMessage.tsx`
**Propósito**: Renderização individual de mensagens
**Tipos**: Usuário, assistente, sistema
**Funcionalidades**:
- ✅ Markdown rendering
- ✅ Code highlighting
- ✅ Timestamps
- ✅ Avatars

#### `ChatMessages.tsx`
**Propósito**: Container scrollável de mensagens
**Funcionalidades**:
- ✅ Auto-scroll para nova mensagem
- ✅ Loading indicators
- ✅ Empty states

#### `ChatSidebar.tsx`
**Propósito**: Gerenciamento de sessões de chat
**Funcionalidades**:
- ✅ Lista de sessões
- ✅ Criação de nova sessão
- ✅ Remoção de sessões
- ✅ Busca/filtro

#### `ChatWindow.tsx`
**Propósito**: Área principal de conversação
**Componentes**: ChatMessages + ChatInput

### 🎛️ Componentes de Interface

#### `ModelSelector.tsx`
**Propósito**: Seleção de modelos de IA disponíveis
**Funcionalidades**:
- ✅ Lista de modelos da API
- ✅ Filtro por tipo/categoria
- ✅ Informações do modelo
- ✅ Favoritos

```typescript
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models: AIModel[];
}
```

## 🎨 Sistema de Design

### Convenções de Nomenclatura
```typescript
// Componentes: PascalCase
export const ChatMessage = () => {}

// Props: PascalCase + Props suffix
interface ChatMessageProps {}

// Estados: camelCase
const [isLoading, setIsLoading] = useState(false)

// Handlers: handle + Action
const handleSubmit = () => {}
const handleInputChange = () => {}
```

### Estrutura Padrão
```typescript
import React from 'react';
import './ComponentName.scss';

interface ComponentProps {
  // Props tipadas
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 
}) => {
  // Estados locais
  // Handlers
  // Effects
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};
```

### Estados Comuns
```typescript
// Loading states
const [loading, setLoading] = useState(false);

// Error handling
const [error, setError] = useState<string | null>(null);

// Form data
const [formData, setFormData] = useState<FormData>(initialState);

// UI states
const [isOpen, setIsOpen] = useState(false);
const [isVisible, setIsVisible] = useState(true);
```

## 🔄 Ciclo de Vida dos Componentes

### 1. **Montagem**
- Inicialização de estados
- Setup de listeners
- Fetch de dados iniciais

### 2. **Atualização**
- Re-render por mudança de props/state
- Validações condicionais
- Efeitos colaterais

### 3. **Desmontagem**
- Cleanup de listeners
- Cancel de requests pendentes
- Limpeza de timers

## 🧪 Testabilidade

### Preparação para Testes
```typescript
// Data attributes para testes
<button data-testid="submit-button">
<input data-testid="email-input">

// Props para facilitar testes
interface TestableProps {
  'data-testid'?: string;
  className?: string;
}
```

### Componentes Mais Críticos
1. **RegisterForm** - Validação complexa
2. **ChatInput** - Interação principal
3. **ModelSelector** - Integração API
4. **ProtectedRoute** - Segurança

## 📈 Métricas de Qualidade

### Complexidade
- **Baixa**: LoginForm, ChatMessage
- **Média**: RegisterForm, ModelSelector  
- **Alta**: Chat, ChatLayout

### Reutilização
- **Alta**: ChatMessage, ProtectedRoute
- **Média**: ChatInput, ModelSelector
- **Baixa**: LoginForm, RegisterForm

### Performance
- **Otimizados**: Todos com React.memo quando necessário
- **Lazy Loading**: Componentes de chat carregados sob demanda
- **Memoização**: Callbacks pesados memoizados
