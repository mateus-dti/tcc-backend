@echo off
echo 🚀 Iniciando teste de integração Frontend-Backend
echo.

REM Verificar se estamos no diretório correto
if not exist "backend" (
    echo ❌ Erro: Execute este script no diretório raiz do projeto (onde estão as pastas backend e frontend)
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Erro: Execute este script no diretório raiz do projeto (onde estão as pastas backend e frontend)
    pause
    exit /b 1
)

echo 📦 Instalando dependências do backend...
cd backend
call npm install
cd ..

echo 📦 Instalando dependências do frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Dependências instaladas!
echo.
echo Para testar a integração:
echo 1. Abra um terminal PowerShell e execute: cd backend; npm run dev
echo 2. Abra outro terminal PowerShell e execute: cd frontend; npm run dev
echo 3. Acesse http://localhost:5173 no seu navegador
echo.
echo 🔧 Certifique-se de que:
echo - O arquivo backend\.env contém OPENROUTER_API_KEY=sua_chave
echo - O backend está rodando em http://localhost:3000
echo - O frontend está rodando em http://localhost:5173
echo.
echo 📋 Para mais detalhes, consulte INTEGRATION_GUIDE.md
echo.
pause
