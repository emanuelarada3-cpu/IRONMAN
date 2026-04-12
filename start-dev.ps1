#!/usr/bin/env pwsh

# Script para iniciar ambos servidores

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🔥 IronMan" -ForegroundColor Cyan
Write-Host "  Starting Development Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js no instalado. Descargalo de https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Backend
Write-Host "[BACKEND] Iniciando en http://localhost:3000/api ..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/k", "cd soldadura-backend && npm run start:dev"

Start-Sleep -Seconds 3

# Frontend
Write-Host "[FRONTEND] Iniciando en http://localhost:4200 ..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/k", "cd soldadura-frontend && ng serve"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Ambos servidores iniciandose..." -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Admin predeterminado:" -ForegroundColor Yellow
Write-Host "  Email: admin@soldadurallastunas.cu" -ForegroundColor Green
Write-Host "  Pass:  Admin1234!" -ForegroundColor Green
Write-Host ""
Write-Host "  Cierra las ventanas cuando termines" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
Read-Host
