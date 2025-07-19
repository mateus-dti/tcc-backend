# Frontend com React, TypeScript e Sass

Este projeto utiliza Sass (SCSS) para estilização em vez do Tailwind CSS.

## Estrutura dos Estilos

```
src/styles/
├── main.scss          # Arquivo principal que importa todos os outros
├── _variables.scss    # Variáveis CSS customizadas
├── _base.scss         # Estilos base e reset
├── _utilities.scss    # Classes utilitárias
├── components/
│   ├── _index.scss    # Importa todos os componentes
│   └── _button.scss   # Estilos do componente Button
└── pages/
    └── _index.scss    # Importa estilos das páginas
```

## Como Usar

### 1. Variáveis CSS
O projeto usa CSS Custom Properties (variáveis CSS) definidas em `_variables.scss`. Você pode usar essas variáveis em qualquer lugar:

```scss
.meu-componente {
  color: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--border-radius);
}
```

### 2. Classes Utilitárias
Classes utilitárias similares ao Tailwind estão disponíveis:

```tsx
<div className="flex items-center justify-center p-4 bg-white rounded shadow">
  Conteúdo
</div>
```

### 3. Componentes com Sass
Para criar estilos de componentes, use a metodologia BEM:

```scss
// _meu-componente.scss
.meu-componente {
  // Estilos base
  
  &__elemento {
    // Estilos do elemento
  }
  
  &--modificador {
    // Estilos do modificador
  }
  
  &:hover {
    // Estados
  }
}
```

### 4. Exemplo de Botão
```tsx
<button className="btn btn--primary btn--large">
  Meu Botão
</button>
```

## Adicionando Novos Estilos

1. **Para componentes**: Crie um arquivo `_nome-do-componente.scss` em `src/styles/components/`
2. **Para páginas**: Crie um arquivo `_nome-da-pagina.scss` em `src/styles/pages/`
3. **Sempre importe** o novo arquivo no respectivo `_index.scss`

## Variáveis Disponíveis

- **Cores**: `--color-primary`, `--color-secondary`, `--color-success`, etc.
- **Espaçamento**: `--spacing-1` até `--spacing-24`
- **Tipografia**: `--font-size-xs` até `--font-size-5xl`
- **Border Radius**: `--border-radius-sm` até `--border-radius-full`
- **Sombras**: `--shadow-sm` até `--shadow-xl`
- **Transições**: `--transition-colors`, `--transition-all`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Visualiza o build de produção
