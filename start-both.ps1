#!/usr/bin/env pwsh

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IronMan - Dev Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Programacion\Nuevo Proyecto\soldadura-backend"
    npm run start:dev
} -Name "Backend"

Write-Host "[BACKEND] Iniciando en http://localhost:3000/api ..." -ForegroundColor Yellow
Write-Host "[FRONTEND] Iniciando en http://localhost:4200 ..." -ForegroundColor Yellow

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Programacion\Nuevo Proyecto\soldadura-frontend"
    npm start
} -Name "Frontend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ambos servidores iniciandose..." -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Admin: admin@soldadurallastunas.cu / Admin1234!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

while ($true) {
    $backendOutput = Receive-Job -Job $backendJob -Keep
    $frontendOutput = Receive-Job -Job $frontendJob -Keep
    if ($backendOutput) { Write-Host $backendOutput }
    if ($frontendOutput) { Write-Host $frontendOutput }
    Start-Sleep -Seconds 2
}