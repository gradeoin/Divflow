Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Divflow n8n Engine Locally  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set local persistent data directory on D: drive
$env:N8N_USER_FOLDER = "$PSScriptRoot\..\.n8n"
$env:N8N_PORT = "5678"

Set-Location "$PSScriptRoot\.."

if (Test-Path ".\node_modules\.bin\n8n.cmd") {
    Write-Host "[OK] Launching n8n from D:\GIThub\Divflow\node_modules..." -ForegroundColor Green
    & ".\node_modules\.bin\n8n.cmd"
} else {
    Write-Host "[OK] Launching n8n via npx..." -ForegroundColor Green
    npx n8n
}
