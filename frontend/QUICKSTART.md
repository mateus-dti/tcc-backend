# 🚀 Guia de Início Rápido - Frontend TCC

Guia prático para desenvolvedores começarem rapidamente com o projeto.

## ⚡ Setup em 5 Minutos

### 1. Pré-requisitos
```bash
# Verificar versões
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
```

### 2. Instalação
```bash
# Clone e acesse o diretório
cd frontend

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. Acesso
- **URL**: http://localhost:5173
- **Hot Reload**: Automático
- **Network**: http://192.168.x.x:5173

## 🎯 Comandos Essenciais

### Desenvolvimento
```bash
npm run dev         # Servidor de desenvolvimento
npm run build       # Build para produção
npm run preview     # Preview do build
```

### Testes
```bash
npm run cypress:open       # Interface gráfica Cypress
npm run cypress:run        # Testes headless
npm run cypress:run:validation  # Apenas validação (sem backend)
npm run test:e2e           # Testes completos (com backend)
```

### Qualidade de Código
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## 📁 Navegação Rápida

### Arquivos Principais
```
frontend/
├── src/
│   ├── App.tsx              # ← Componente raiz
│   ├── main.tsx             # ← Entry point
│   ├── context.tsx          # ← Estado global (Context API)
│   │
│   ├── components/          # ← Todos os componentes React
│   │   ├── LoginForm.tsx    # ← Autenticação
│   │   ├── RegisterForm.tsx # ← Registro com validação ⭐
│   │   └── Chat*.tsx        # ← Interface de chat
│   │
│   ├── pages/               # ← Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ChatPage.tsx
│   │
│   ├── context/            # ← Contextos React
│   │   └── AuthContext.tsx
│   │
│   ├── services/           # ← Integração com API
│   │   └── api.ts
│   │
│   ├── styles/             # ← Sistema SASS
│   │   ├── main.scss       # ← Arquivo principal
│   │   ├── _variables.scss # ← Variáveis do tema
│   │   └── components/     # ← Estilos por componente
│   │
│   └── types/              # ← Tipos TypeScript
│       └── index.ts
│
├── cypress/                # ← Testes E2E
│   ├── e2e/                # ← Cenários de teste
│   ├── fixtures/           # ← Dados mock
│   └── support/            # ← Configurações
│
└── public/                 # ← Assets estáticos
```

## 🔧 Configurações Importantes

### Environment Variables
```env
# .env.local (criar se necessário)
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### VS Code (Recomendado)
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Extensões VS Code Úteis
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- SCSS IntelliSense

## 🎨 Sistema de Design Rápido

### Cores do Tema Dark
```scss
// Copie para usar em novos componentes
$bg-primary: #0a0a0a;      // Fundo principal
$bg-secondary: #1a1a1a;    // Cards/componentes
$text-primary: #ffffff;    // Texto principal
$text-secondary: #cccccc;  // Texto secundário
$primary-color: #007bff;   // Cor de destaque
$border-color: #333333;    // Bordas
```

### Classes Utilitárias
```html
<!-- Spacing -->
<div class="p-lg m-md">          <!-- padding large, margin medium -->

<!-- Flexbox -->
<div class="d-flex justify-center align-center">

<!-- Text -->
<p class="text-center text-muted">

<!-- States -->
<div class="error">              <!-- Estado de erro -->
<div class="loading">            <!-- Estado de carregamento -->
```

### Estrutura de Componente
```typescript
// Template para novos componentes
import React, { useState } from 'react';
import './ComponentName.scss';

interface ComponentNameProps {
  // Defina as props aqui
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  prop1, 
  prop2 
}) => {
  const [localState, setLocalState] = useState();
  
  const handleSomething = () => {
    // Handler logic
  };
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};
```

## 🧪 Testando Rapidamente

### Teste de Validação (Sempre Funciona)
```bash
# Execute apenas os testes de validação
npm run cypress:run:validation

# Resultado esperado: 6/6 testes passando ✅
```

### Teste Manual Essencial
1. **Registro**: http://localhost:5173/register
   - Teste validação em tempo real
   - Confirme senha obrigatória
   
2. **Login**: http://localhost:5173/login
   - Interface responsiva
   - Estados de loading

3. **Responsividade**:
   - Mobile: F12 > Toggle device toolbar
   - Teste em 375px, 768px, 1280px

## 🐛 Troubleshooting Comum

### Porta Ocupada
```bash
# Se a porta 5173 estiver ocupada
npm run dev -- --port 3001
```

### Dependências Quebradas
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Cypress não Abre
```bash
# Verificar instalação
npx cypress verify

# Reinstalar se necessário
npm install cypress --save-dev
```

### TypeScript Errors
```bash
# Verificar tipos
npm run type-check

# Atualizar @types se necessário
npm update @types/react @types/react-dom
```

## 📚 Recursos Úteis

### Documentação
- **React 19**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Cypress**: https://docs.cypress.io/

### Componentes Prontos
- `LoginForm`: Autenticação simples
- `RegisterForm`: Com validação robusta ⭐
- `ProtectedRoute`: HOC de proteção
- `ModelSelector`: Para escolha de IA

### Hooks Customizados
- `useAuth`: Estado de autenticação
- `useChat`: Gerenciamento de chat

## 🔄 Fluxo de Desenvolvimento

### 1. Nova Feature
```bash
# Criar branch
git checkout -b feature/nome-da-feature

# Desenvolver
# Componente + Estilo + Tipo

# Testar
npm run cypress:run:validation

# Commit
git add .
git commit -m "feat: adiciona nova feature"
```

### 2. Bug Fix
```bash
# Reproduzir o bug
# Criar teste que falha
# Corrigir o código
# Verificar se teste passa
```

### 3. Deploy
```bash
# Build
npm run build

# Verificar dist/
npm run preview

# Deploy (conforme configuração)
```

## 🎯 Próximos Passos

### Para Novos Desenvolvedores
1. ✅ Execute o projeto localmente
2. ✅ Rode os testes de validação
3. ✅ Explore os componentes existentes
4. ✅ Leia a documentação dos READMEs
5. 🔄 Implemente uma nova feature

### Para Desenvolvimento Contínuo
- 📝 **Chat Interface**: Implementar interface completa
- 🔒 **Autenticação Real**: Integrar com backend
- 🎨 **Temas**: Sistema de temas claro/escuro
- ♿ **Acessibilidade**: Melhorar suporte a screen readers
- 📱 **PWA**: Transformar em Progressive Web App

---

**💡 Dica**: Mantenha este guia atualizado conforme o projeto evolui!
