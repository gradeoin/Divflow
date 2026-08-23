Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Free Cloudflare Webhook Tunnel " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot"

if (Test-Path ".\cloudflared.exe") {
    & ".\cloudflared.exe" tunnel --url http://localhost:5678
} else {
    Write-Host "[!] cloudflared.exe not found in scripts folder." -ForegroundColor Yellow
}
