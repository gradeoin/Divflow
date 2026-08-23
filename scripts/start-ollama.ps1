Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Local Ollama AI Engine      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set model directory to D: drive
$env:OLLAMA_MODELS = "D:\ollama_models"
$env:PATH += ";D:\Ollama"

Write-Host "[OK] Models storage set to: D:\ollama_models" -ForegroundColor Green
Write-Host "[OK] Starting Ollama server on http://localhost:11434..." -ForegroundColor Green

& "D:\Ollama\ollama.exe" serve
