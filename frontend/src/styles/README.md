# 🎨 Sistema de Estilos SASS

Sistema de design modular e responsivo usando SASS/SCSS para manutenção eficiente e escalabilidade.

## 📁 Estrutura de Arquivos

```
styles/
├── main.scss              # Arquivo principal de importação
├── _variables.scss        # Variáveis globais
├── _base.scss            # Reset e estilos base
├── _utilities.scss       # Classes utilitárias
├── components/           # Estilos por componente
│   ├── _index.scss       # Barrel import dos componentes
│   ├── _auth-form.scss   # Formulários de autenticação
│   ├── _button.scss      # Sistema de botões
│   ├── _chat-input.scss  # Input de chat
│   ├── _chat-layout.scss # Layout do chat
│   ├── _chat-messages.scss # Mensagens do chat
│   ├── _model-selector.scss # Seletor de modelos
│   ├── _responsive.scss  # Breakpoints e media queries
│   └── _enhancements.scss # Melhorias visuais
└── pages/                # Estilos específicos de páginas
    ├── _index.scss       # Barrel import das páginas
    └── _pages.scss       # Estilos das páginas
```

## 🎨 Sistema de Design

### 🌑 Tema Ultra Dark

#### Cores Primárias
```scss
// Backgrounds
$bg-primary: #0a0a0a;      // Fundo principal ultra escuro
$bg-secondary: #1a1a1a;    // Fundo secundário
$bg-tertiary: #2a2a2a;     // Fundo de cards/componentes

// Borders & Dividers
$border-color: #333333;     // Bordas padrão
$border-focus: #4a9eff;     // Bordas em foco
$border-error: #ff4444;     // Bordas de erro

// Text
$text-primary: #ffffff;     // Texto principal
$text-secondary: #cccccc;   // Texto secundário
$text-muted: #888888;       // Texto discreto
$text-error: #ff6b6b;       // Texto de erro
$text-success: #51cf66;     // Texto de sucesso
```

#### Estados Interativos
```scss
// Primary Button
$primary-color: #007bff;
$primary-hover: #0056b3;
$primary-active: #004085;

// Success States
$success-color: #28a745;
$success-hover: #218838;

// Error States
$error-color: #dc3545;
$error-hover: #c82333;

// Warning States
$warning-color: #ffc107;
$warning-hover: #e0a800;
```

### 📏 Espacamento e Tipografia

#### Sistema de Espacamento
```scss
$spacing-xs: 0.25rem;    // 4px
$spacing-sm: 0.5rem;     // 8px
$spacing-md: 1rem;       // 16px
$spacing-lg: 1.5rem;     // 24px
$spacing-xl: 2rem;       // 32px
$spacing-xxl: 3rem;      // 48px
```

#### Tipografia
```scss
$font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-xxl: 1.5rem;    // 24px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

#### Breakpoints Responsivos
```scss
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;

// Mixins para media queries
@mixin mobile { @media (max-width: #{$mobile - 1px}) { @content; } }
@mixin tablet { @media (min-width: $mobile) and (max-width: #{$desktop - 1px}) { @content; } }
@mixin desktop { @media (min-width: $desktop) { @content; } }
@mixin wide { @media (min-width: $wide) { @content; } }
```

## 🧩 Componentes Estilizados

### 🔐 Formulários de Autenticação (`_auth-form.scss`)

#### Estrutura Principal
```scss
.auth-form {
  background: $bg-secondary;
  border: 1px solid $border-color;
  border-radius: $border-radius-lg;
  padding: $spacing-xxl;
  max-width: 400px;
  margin: 0 auto;
  
  @include mobile {
    padding: $spacing-xl;
    margin: $spacing-md;
  }
}
```

#### Estados de Validação ⭐
```scss
.form-group {
  &.error {
    .form-input {
      border-color: $border-error;
      background: rgba($error-color, 0.1);
    }
    
    .form-label {
      color: $text-error;
    }
  }
  
  &.valid {
    .form-input {
      border-color: $success-color;
    }
  }
}

.error-message {
  color: $text-error;
  font-size: $font-size-sm;
  margin-top: $spacing-xs;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}
```

### 🔘 Sistema de Botões (`_button.scss`)

#### Botão Primário
```scss
.btn-primary {
  background: $primary-color;
  color: white;
  border: none;
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: $primary-hover;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #333333;
    color: #666666;
    cursor: not-allowed;
    transform: none;
  }
}
```

### 💬 Interface de Chat

#### Layout Principal (`_chat-layout.scss`)
```scss
.chat-layout {
  display: flex;
  height: 100vh;
  background: $bg-primary;
  
  .chat-sidebar {
    width: 280px;
    background: $bg-secondary;
    border-right: 1px solid $border-color;
    
    @include mobile {
      position: fixed;
      left: -280px;
      transition: left 0.3s ease;
      z-index: 1000;
      
      &.open {
        left: 0;
      }
    }
  }
  
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
```

#### Mensagens (`_chat-messages.scss`)
```scss
.chat-message {
  margin-bottom: $spacing-lg;
  
  &.user {
    .message-content {
      background: $primary-color;
      color: white;
      margin-left: auto;
      max-width: 80%;
    }
  }
  
  &.assistant {
    .message-content {
      background: $bg-secondary;
      color: $text-primary;
      max-width: 80%;
    }
  }
}
```

### 📱 Design Responsivo (`_responsive.scss`)

#### Estratégia Mobile-First
```scss
// Base styles (mobile)
.container {
  padding: $spacing-md;
}

// Tablet adjustments
@include tablet {
  .container {
    padding: $spacing-lg $spacing-xl;
  }
}

// Desktop enhancements
@include desktop {
  .container {
    padding: $spacing-xl $spacing-xxl;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## 🔧 Utilitários e Mixins

### Classes Utilitárias (`_utilities.scss`)
```scss
// Spacing utilities
.m-0 { margin: 0; }
.m-auto { margin: auto; }
.p-0 { padding: 0; }
.mt-auto { margin-top: auto; }

// Flexbox utilities
.d-flex { display: flex; }
.flex-column { flex-direction: column; }
.justify-center { justify-content: center; }
.align-center { align-items: center; }

// Text utilities
.text-center { text-align: center; }
.text-error { color: $text-error; }
.text-success { color: $text-success; }
.text-muted { color: $text-muted; }

// Visibility
.sr-only { /* Screen reader only */ }
.hidden { display: none; }
```

### Mixins Importantes
```scss
// Smooth transitions
@mixin transition($property: all, $duration: 0.3s, $easing: ease) {
  transition: $property $duration $easing;
}

// Box shadows
@mixin shadow-light {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@mixin shadow-medium {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

// Input focus states
@mixin input-focus {
  outline: none;
  border-color: $border-focus;
  box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
}
```

## 🚀 Funcionalidades Avançadas

### ✨ Melhorias Visuais (`_enhancements.scss`)

#### Animações e Transições
```scss
// Loading animations
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}

// Slide animations
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

#### Estados Hover Avançados
```scss
.interactive-element {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

### 🎯 Acessibilidade

#### Focus Management
```scss
*:focus {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
}

.focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
}

// Skip to content
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: $primary-color;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}
```

#### Contraste de Cores
```scss
// High contrast mode support
@media (prefers-contrast: high) {
  :root {
    --border-color: #ffffff;
    --text-muted: #cccccc;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📊 Performance e Otimização

### Estratégias de Carregamento
1. **Critical CSS**: Estilos base inline
2. **Code Splitting**: Componentes por demanda
3. **Purge CSS**: Remoção de estilos não utilizados
4. **Minificação**: Build otimizado para produção

### Boas Práticas
- ✅ **BEM Methodology** para nomenclatura
- ✅ **Mobile-First** approach
- ✅ **Variáveis consistentes** para manutenção
- ✅ **Mixins reutilizáveis** para DRY
- ✅ **Modularização** por componente

### Métricas de CSS
- **Tamanho compilado**: ~45KB (sem minificação)
- **Variáveis**: 50+ definidas
- **Breakpoints**: 4 responsivos
- **Componentes**: 15+ estilizados
