Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Free Cloudflare Webhook Tunnel " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if cloudflared is installed
if (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Launching Cloudflare Tunnel for n8n (Port 5678)..." -ForegroundColor Green
    cloudflared tunnel --url http://localhost:5678
} else {
    Write-Host "[!] cloudflared not found. Installing via winget..." -ForegroundColor Yellow
    winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
    cloudflared tunnel --url http://localhost:5678
}
