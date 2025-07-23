# Estrutura de Serviços API - Frontend

Esta documentação descreve a nova estrutura organizada dos serviços de API do frontend.

## 📁 Estrutura de Diretórios

```
src/
├── services/
│   ├── api/
│   │   ├── config.ts          # Configuração base do Axios
│   │   ├── authService.ts     # Serviços de autenticação
│   │   ├── chatService.ts     # Serviços de chat e modelos
│   │   ├── sessionService.ts  # Serviços de sessões
│   │   └── index.ts          # Exportações centralizadas
│   └── api.ts                # Compatibilidade com código antigo
└── types/
    ├── api.ts                # Tipos base da API
    ├── auth.ts               # Tipos de autenticação
    ├── chat.ts               # Tipos de chat e modelos
    ├── session.ts            # Tipos de sessões
    └── index.ts             # Re-exportação de todos os tipos
```

## 🔧 Serviços Disponíveis

### AuthService (`authService`)
Gerencia autenticação e autorização:
- `login(credentials)` - Fazer login
- `register(userData)` - Registrar novo usuário
- `me()` - Obter dados do usuário atual
- `logout()` - Fazer logout
- `isAuthenticated()` - Verificar se está autenticado
- `getCurrentUser()` - Obter usuário do localStorage
- `getToken()` - Obter token de autenticação

### ChatService (`chatService`)
Gerencia chat e modelos de IA:
- `getModels()` - Buscar modelos disponíveis
- `sendMessage(modelId, message)` - Enviar mensagem simples
- `sendConversationMessage(modelId, message, context)` - Enviar com contexto
- `startChatSession(title, modelId, initialMessage)` - Iniciar nova sessão
- `sendSessionMessage(sessionId, message, modelId)` - Enviar na sessão
- `getSessionHistory(sessionId, limit, offset)` - Buscar histórico

### SessionService (`sessionService`)
Gerencia sessões de chat:
- `createSession(userId, title, model)` - Criar nova sessão
- `getUserSessions(userId)` - Buscar sessões do usuário
- `getSession(sessionId)` - Obter sessão específica
- `deleteSession(sessionId)` - Deletar sessão
- `updateSessionTitle(sessionId, title)` - Atualizar título

## 📝 Tipos Organizados

### API Base (`types/api.ts`)
- `ApiResponse<T>` - Resposta padrão da API
- `PaginationInfo` - Informações de paginação
- `ChatUsage` - Informações de uso de tokens

### Autenticação (`types/auth.ts`)
- `User` - Dados do usuário
- `LoginRequest` / `RegisterRequest` - Requisições de auth
- `AuthResponse` / `AuthData` - Respostas de auth

### Chat (`types/chat.ts`)
- `Model` - Modelo de IA
- `ChatMessage` / `ChatMessageResponse` - Mensagens
- `ChatResponse` / `ModelsResponse` - Respostas da API

### Sessões (`types/session.ts`)
- `Session` - Sessão de chat
- `CreateSessionRequest` / `UpdateSessionRequest` - Requisições
- `SessionResponse` / `SessionsResponse` - Respostas

## 🔄 Compatibilidade

O arquivo `services/api.ts` mantém compatibilidade com código existente:

```typescript
// Ainda funciona (backward compatibility)
import { authService, chatService, sessionService } from '../services/api';
import { login, register, getModels } from '../services/api'; // Deprecated

// Nova forma recomendada
import { authService } from '../services/api/authService';
import { chatService } from '../services/api/chatService';
```

## 🚀 Como Usar

### Exemplo: Autenticação
```typescript
import { authService } from '../services/api/authService';

// Login
const { user, token } = await authService.login({ email, password });

// Verificar se está logado
if (authService.isAuthenticated()) {
  const currentUser = authService.getCurrentUser();
}
```

### Exemplo: Chat
```typescript
import { chatService } from '../services/api/chatService';

// Buscar modelos
const models = await chatService.getModels();

// Iniciar sessão de chat
const { session } = await chatService.startChatSession('Nova Conversa', modelId);

// Enviar mensagem
const result = await chatService.sendSessionMessage(sessionId, message, modelId);
```

### Exemplo: Sessões
```typescript
import { sessionService } from '../services/api/sessionService';

// Buscar sessões do usuário
const sessions = await sessionService.getUserSessions(userId);

// Atualizar título
await sessionService.updateSessionTitle(sessionId, 'Novo Título');
```

## 🎯 Benefícios da Nova Estrutura

1. **Separação de Responsabilidades**: Cada serviço tem uma responsabilidade específica
2. **Tipos Organizados**: Types agrupados por contexto em arquivos separados
3. **Reutilização**: Serviços podem ser importados individualmente
4. **Manutenibilidade**: Código mais fácil de manter e estender
5. **IntelliSense**: Melhor autocomplete no VS Code
6. **Compatibilidade**: Código antigo continua funcionando
7. **Singleton Pattern**: Instâncias únicas dos serviços

## 🔧 Configuração

A configuração do Axios está centralizada em `services/api/config.ts`:
- Interceptors de autenticação
- Tratamento de erros 401
- Base URL configurável via environment variables
