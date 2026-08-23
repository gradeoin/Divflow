Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     Launching All Divflow Services     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Start Ollama Server in Background
Write-Host "[1/3] Starting Local Ollama AI Engine..." -ForegroundColor Yellow
$env:OLLAMA_MODELS = "D:\ollama_models"
$env:PATH += ";D:\Ollama"
Start-Process -FilePath "D:\Ollama\ollama.exe" -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 2
Write-Host "[OK] Ollama is active on http://127.0.0.1:11434" -ForegroundColor Green

# 2. Start Cloudflare Tunnel in Background
Write-Host "[2/3] Starting Cloudflare HTTPS Tunnel..." -ForegroundColor Yellow
Start-Process -FilePath "D:\GIThub\Divflow\scripts\cloudflared.exe" -ArgumentList "tunnel --url http://localhost:5678" -WindowStyle Hidden
Start-Sleep -Seconds 3
Write-Host "[OK] Cloudflare Tunnel is active" -ForegroundColor Green

# 3. Start n8n Local Engine
Write-Host "[3/3] Starting n8n Automation Engine on http://localhost:5678..." -ForegroundColor Yellow
$env:N8N_USER_FOLDER = "$PSScriptRoot\..\.n8n"
$env:N8N_PORT = "5678"
Set-Location "$PSScriptRoot\.."

if (Test-Path ".\node_modules\.bin\n8n.cmd") {
    & ".\node_modules\.bin\n8n.cmd"
} else {
    npx n8n
}
