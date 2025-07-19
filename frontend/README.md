# Frontend - TCC Project

Este é o frontend do projeto TCC, construído com React, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para requisições à API
- **React Router** - Roteamento para aplicações React

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`
Executa a aplicação em modo de desenvolvimento.
Abra [http://localhost:5173](http://localhost:5173) para visualizar no navegador.

### `npm run build`
Constrói a aplicação para produção na pasta `dist`.

### `npm run preview`
Visualiza a versão de produção localmente.

## Estrutura do Projeto

```
src/
  ├── assets/          # Arquivos estáticos (imagens, ícones, etc.)
  ├── components/      # Componentes reutilizáveis
  ├── pages/          # Páginas da aplicação
  ├── services/       # Serviços para comunicação com API
  ├── hooks/          # Custom hooks
  ├── utils/          # Funções utilitárias
  ├── types/          # Definições de tipos TypeScript
  └── App.tsx         # Componente principal
```

## Configuração do Backend

Certifique-se de que o backend está rodando na porta correta para que as requisições funcionem adequadamente.

## Desenvolvimento

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação em `http://localhost:5173`

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
