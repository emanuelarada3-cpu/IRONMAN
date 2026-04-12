@echo off
REM Script para iniciar ambos servidores simultáneamente
REM Requiere: Node.js v22+, npm v11+

title IronMan - Development Server

echo.
echo ========================================
echo   🔥 IronMan
echo   Starting Development Environment
echo ========================================
echo.

REM Verificar Node.js instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado
    echo Descargalo de: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js y npm detectados
echo.

REM Terminal 1: Backend
echo [BACKEND] Iniciando en http://localhost:3000/api ...
start "Backend NestJS - Soldadura" cmd /k "cd soldadura-backend && npm run start:dev"

REM Esperar 3 segundos
timeout /t 3 /nobreak

REM Terminal 2: Frontend
echo [FRONTEND] Iniciando en http://localhost:4200 ...
start "Frontend Angular - Soldadura" cmd /k "cd soldadura-frontend && ng serve"

echo.
echo ========================================
echo  ✅ Ambos servidores iniciandose...
echo  
echo  Backend:  http://localhost:3000/api
echo  Frontend: http://localhost:4200
echo  
echo  Admin default:
echo  Email: admin@soldadurallastunas.cu
echo  Pass:  Admin1234!
echo  
echo  Cierra estas ventanas cuando termines
echo ========================================
echo.

pause
