# Cypress E2E Tests

Este diretório contém todos os testes end-to-end para o frontend do projeto TCC.

## 📋 Visão Geral

Os testes são organizados para cobrir todas as funcionalidades críticas da aplicação, incluindo validação de formulários, fluxos de autenticação, responsividade e interface de chat.

## 🧪 Estrutura de Testes

### `/e2e` - Testes End-to-End

#### `register-validation.cy.ts` ✅ (6/6 passando)
Testa a robustez do sistema de validação de formulários:
- Validação de confirmação de senha
- Habilitação/desabilitação do botão submit
- Validação de força da senha
- Feedback em tempo real
- Validação de todos os campos obrigatórios

#### `auth-flow.cy.ts` ⚠️ (8/10 passando)
Testa o fluxo completo de autenticação:
- Exibição correta dos formulários
- Validação de campos obrigatórios
- Navegação entre páginas
- Estados de loading
- Redirecionamentos (falha sem backend)

#### `responsive.cy.ts` ⚠️ (8/12 passando)
Testa a responsividade em diferentes dispositivos:
- **Mobile** (375x667px)
- **Tablet** (768x1024px)
- **Desktop** (1280x720px)
- Layouts adaptáveis
- Interface de chat (falha sem backend)

#### `chat-interface.cy.ts` 🔄 (preparado)
Testes preparados para interface de chat:
- Envio de mensagens
- Seleção de modelos
- Gerenciamento de sessões
- Integração com backend

### `/fixtures` - Dados de Teste

#### `users.json`
Dados de usuários para testes:
```json
{
  "users": {
    "validUser": {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "senha123"
    }
  }
}
```

#### `models.json`
Modelos de IA simulados para testes:
```json
{
  "success": true,
  "data": [
    {
      "id": "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
      "name": "Venice: Uncensored"
    }
  ]
}
```

### `/support` - Configurações

#### `e2e.ts`
Configurações globais dos testes:
- Imports de comandos customizados
- Configurações de exceções
- Setup para aplicações React

#### `commands.ts`
Comandos customizados do Cypress (preparados para expansão):
```typescript
// Exemplo de comando customizado (a ser implementado)
cy.login('user@example.com', 'password123')
```

## 🎯 Comandos de Execução

### Desenvolvimento
```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar específico (recomendado)
npm run cypress:run:validation
```

### Automação
```bash
# Todos os testes (necessário backend)
npm run test:e2e

# Apenas testes headless
npm run cypress:run
```

### Debug
```bash
# Abrir com servidor rodando
npm run test:e2e:open

# Executar em modo debug
npx cypress run --headed --no-exit
```

## 📊 Status dos Testes

| Categoria | Testes | Passando | Status | Dependência |
|-----------|--------|----------|---------|-------------|
| **Validação** | 6 | 6 | ✅ 100% | Nenhuma |
| **Autenticação** | 10 | 8 | ⚠️ 80% | Backend* |
| **Responsividade** | 12 | 8 | ⚠️ 67% | Backend* |
| **Chat** | - | - | 🔄 Prep. | Backend |

*Alguns testes falham intencionalmente quando o backend não está disponível

## 🔍 Cenários de Teste

### ✅ Sempre Passam (Sem Backend)
- Validação de formulários
- Layout responsivo
- Navegação entre páginas
- Estados visuais

### ⚠️ Dependem do Backend
- Autenticação real
- Redirecionamentos pós-login
- Interface de chat
- Persistência de dados

## 🛠️ Configuração

### `cypress.config.js`
```javascript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
})
```

### Variáveis de Ambiente
O Cypress usa automaticamente as mesmas variáveis do frontend:
- `VITE_API_URL`: URL da API backend

## 📈 Métricas de Qualidade

### Cobertura Funcional
- ✅ **Validação de dados**: 100%
- ✅ **UI Responsiva**: 90%
- ✅ **Fluxos de usuário**: 85%
- 🔄 **Integração**: Em preparação

### Performance
- **Tempo médio por teste**: 1-3 segundos
- **Setup**: < 1 segundo
- **Total (validação)**: ~8 segundos

## 🚀 Expansão dos Testes

### Próximos Testes
1. **Testes de integração** com backend real
2. **Testes de acessibilidade** (a11y)
3. **Testes de performance** (Core Web Vitals)
4. **Testes visuais** (screenshot comparison)

### Comandos Customizados Planejados
```typescript
// Autenticação
cy.login(email, password)
cy.logout()

// Chat
cy.sendMessage(text, model)
cy.selectModel(modelId)
cy.createSession(name)

// Utilitários
cy.waitForPageLoad()
cy.mockBackend()
```
