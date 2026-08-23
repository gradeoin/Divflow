Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Local Ollama AI Engine      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Ensure model directory is on D: drive
$env:OLLAMA_MODELS = "D:\ollama_models"
$env:PATH += ";$env:LOCALAPPDATA\Programs\Ollama"

Write-Host "[OK] Models storage set to: D:\ollama_models" -ForegroundColor Green
Write-Host "[OK] Starting Ollama server on http://localhost:11434..." -ForegroundColor Green

& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" serve
