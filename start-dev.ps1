# start-dev.ps1 - Launch both backend and frontend dev servers

Write-Host "Starting Habit Tracker (local dev)..." -ForegroundColor Cyan

# Start Backend
Write-Host "Starting Backend (port 5000)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    # Use the script directory as the repo root so this works on different machines
    $scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Definition }
    Set-Location (Join-Path $scriptRoot 'Backend')
    # Use npm run dev to pick up nodemon when available
    & npm run dev
} -Name "HabitTracker-Backend"

Start-Sleep -Seconds 3
Write-Host "Backend job started" -ForegroundColor Green

# Start Frontend
Write-Host "Starting Frontend (port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    $scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Definition }
    Set-Location (Join-Path $scriptRoot 'frontend')
    & npm run dev
} -Name "HabitTracker-Frontend"

Start-Sleep -Seconds 3
Write-Host "Frontend job started" -ForegroundColor Green

Write-Host "" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Habit Tracker is running locally!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all servers." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan

# Keep parent process alive
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    Write-Host "Stopping all servers..." -ForegroundColor Red
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "All servers stopped." -ForegroundColor Green
}
