@echo off
echo ========================================
echo Parando TCC Application Stack
echo ========================================

echo.
echo [1/3] Parando servicos do Docker...
cd /d "%~dp0backend"
docker-compose down
if %errorlevel% neq 0 (
    echo AVISO: Problema ao parar os servicos do Docker.
)

echo.
echo [2/3] Finalizando processos Node.js...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ts-node-dev.exe >nul 2>&1

echo.
echo [3/3] Limpando recursos...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Todos os servicos foram parados!
echo ========================================
echo.
pause
