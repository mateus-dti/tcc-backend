@echo off
echo 🧪 Testando Integração Frontend-Backend com Autenticação
echo.

REM Verificar se estamos no diretório correto
if not exist "backend" (
    echo ❌ Erro: Execute este script no diretório raiz do projeto
    pause
    exit /b 1
)

echo 📡 Testando Backend...
echo.

REM Testar health check
echo Testando health check...
curl -s http://localhost:3000/health > nul
if %errorlevel% neq 0 (
    echo ❌ Backend não está respondendo. Certifique-se de que está rodando com 'npm run dev'
    pause
    exit /b 1
)
echo ✅ Backend respondendo

REM Testar endpoint de modelos
echo Testando endpoint de modelos...
curl -s http://localhost:3000/api/chat/models > nul
if %errorlevel% neq 0 (
    echo ❌ Endpoint de modelos não está respondendo
    pause
    exit /b 1
)
echo ✅ Endpoint de modelos funcionando

REM Testar registro de usuário
echo Testando registro de usuário...
curl -s -X POST ^
  http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Teste User\",\"email\":\"teste@test.com\",\"password\":\"123456\"}" > temp_response.json
if %errorlevel% neq 0 (
    echo ❌ Endpoint de registro não está funcionando
    del temp_response.json 2>nul
    pause
    exit /b 1
)

REM Verificar se retornou sucesso ou erro de email já existe (ambos são ok)
findstr /c:"success" temp_response.json > nul
if %errorlevel% equ 0 (
    echo ✅ Endpoint de registro funcionando
) else (
    findstr /c:"já existe" temp_response.json > nul
    if %errorlevel% equ 0 (
        echo ✅ Endpoint de registro funcionando (usuário já existe)
    ) else (
        echo ❌ Problema no endpoint de registro
        type temp_response.json
        del temp_response.json 2>nul
        pause
        exit /b 1
    )
)

del temp_response.json 2>nul

echo.
echo 🎉 Todos os testes passaram!
echo.
echo 📋 Para usar a aplicação:
echo 1. Backend está rodando em: http://localhost:3000
echo 2. Inicie o frontend com: cd frontend ^&^& npm run dev
echo 3. Acesse: http://localhost:5173
echo 4. Crie uma conta ou use:
echo    - Email: joao@email.com / Senha: 123456
echo    - Email: maria@email.com / Senha: 123456
echo.
pause
