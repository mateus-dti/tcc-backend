@echo off
echo ========================================
echo Iniciando TCC Application Stack
echo ========================================

echo.
echo [1/4] Verificando se o Docker esta rodando...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao encontrado ou nao esta rodando.
    echo Por favor, inicie o Docker Desktop antes de executar este script.
    pause
    exit /b 1
)

echo [2/4] Iniciando servicos do Docker (Redis)...
cd /d "%~dp0backend"
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERRO: Falha ao iniciar os servicos do Docker.
    pause
    exit /b 1
)

echo.
echo [3/4] Aguardando Redis inicializar...
timeout /t 10 /nobreak >nul

echo [3/4] Instalando dependencias e iniciando Backend...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do backend.
    pause
    exit /b 1
)

echo Iniciando servidor backend em modo desenvolvimento...
start "Backend Server" cmd /k "npm run dev"

echo.
echo [4/4] Aguardando backend inicializar...
timeout /t 15 /nobreak >nul

echo [4/4] Instalando dependencias e iniciando Frontend...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do frontend.
    pause
    exit /b 1
)

echo Iniciando servidor frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Todos os servicos foram iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo Redis Commander: http://localhost:8081
echo.
echo Pressione qualquer tecla para abrir o navegador no frontend...
pause >nul

start http://localhost:5173

echo.
echo Para parar todos os servicos:
echo 1. Feche as janelas do terminal do Backend e Frontend
echo 2. Execute: docker-compose down no diretorio backend
echo.
pause
