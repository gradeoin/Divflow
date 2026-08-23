Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Divflow n8n Engine Locally  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set local persistent data directory
$env:N8N_USER_FOLDER = "$PSScriptRoot\..\.n8n"
$env:N8N_PORT = "5678"

Write-Host "[OK] Starting n8n on http://localhost:5678..." -ForegroundColor Green
npx n8n
