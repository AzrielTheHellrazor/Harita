# Base Mini App Test Başlatma Scripti
# Bu script ngrok veya cloudflare tunnel ile public URL oluşturur

Write-Host "`n🚀 Base Mini App Test Başlatılıyor...`n" -ForegroundColor Cyan

# Next.js sunucusunun çalışıp çalışmadığını kontrol et
$nextProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
if (-not $nextProcess) {
    Write-Host "⚠️ Next.js sunucusu çalışmıyor!" -ForegroundColor Yellow
    Write-Host "Önce 'npm run start' veya 'npm run dev' çalıştırın.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Next.js sunucusu çalışıyor`n" -ForegroundColor Green

# ngrok kontrolü
if (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "🌐 ngrok ile public URL oluşturuluyor...`n" -ForegroundColor Cyan
    Write-Host "Public URL oluşturulduktan sonra:" -ForegroundColor Yellow
    Write-Host "1. Terminal'de görünen URL'i kopyalayın" -ForegroundColor White
    Write-Host "2. Base Developer Platform'da Mini App oluşturun" -ForegroundColor White
    Write-Host "3. Mini App URL'ine bu URL'i ekleyin`n" -ForegroundColor White
    Write-Host "Durdurmak için Ctrl+C basın`n" -ForegroundColor Gray
    Start-Sleep -Seconds 2
    ngrok http 3000
}
# Cloudflare Tunnel kontrolü
elseif (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "🌐 Cloudflare Tunnel ile public URL oluşturuluyor...`n" -ForegroundColor Cyan
    Write-Host "Public URL oluşturulduktan sonra:" -ForegroundColor Yellow
    Write-Host "1. Terminal'de görünen URL'i kopyalayın" -ForegroundColor White
    Write-Host "2. Base Developer Platform'da Mini App oluşturun" -ForegroundColor White
    Write-Host "3. Mini App URL'ine bu URL'i ekleyin`n" -ForegroundColor White
    Write-Host "Durdurmak için Ctrl+C basın`n" -ForegroundColor Gray
    Start-Sleep -Seconds 2
    cloudflared tunnel --url http://localhost:3000
}
else {
    Write-Host "❌ Ne ngrok ne de Cloudflare Tunnel yüklü!" -ForegroundColor Red
    Write-Host "`n📥 Yüklemek için:" -ForegroundColor Yellow
    Write-Host "   ngrok: https://ngrok.com/download" -ForegroundColor White
    Write-Host "   Cloudflare: winget install --id Cloudflare.cloudflared`n" -ForegroundColor White
    exit 1
}

