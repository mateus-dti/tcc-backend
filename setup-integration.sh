#!/bin/bash

echo "🚀 Iniciando teste de integração Frontend-Backend"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto (onde estão as pastas backend e frontend)"
    exit 1
fi

echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Dependências instaladas!"
echo ""
echo "Para testar a integração:"
echo "1. Abra um terminal e execute: cd backend && npm run dev"
echo "2. Abra outro terminal e execute: cd frontend && npm run dev"
echo "3. Acesse http://localhost:5173 no seu navegador"
echo ""
echo "🔧 Certifique-se de que:"
echo "- O arquivo backend/.env contém OPENROUTER_API_KEY=sua_chave"
echo "- O backend está rodando em http://localhost:3000"
echo "- O frontend está rodando em http://localhost:5173"
echo ""
echo "📋 Para mais detalhes, consulte INTEGRATION_GUIDE.md"
