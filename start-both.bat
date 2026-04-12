@echo off

echo.
echo ========================================
echo   IronMan - Dev Environment
echo ========================================
echo.

echo [BACKEND] Iniciando en http://localhost:3000/api ...
echo [FRONTEND] Iniciando en http://localhost:4200 ...
echo.

cd soldadura-backend
start /B npm run start:dev > backend.log 2>&1

cd ..\soldadura-frontend
start /B npm start > frontend.log 2>&1

cd ..

echo ========================================
echo   Ambos servidores iniciandose...
echo.
echo   Backend:  http://localhost:3000/api
echo   Frontend: http://localhost:4200
echo.
echo   Admin: admin@soldadurallunas.cu / Admin1234!
echo ========================================
echo.

timeout /t 5 > nul

start http://localhost:4200