# 🚀 Next.js Sunucusunu Başlatma Rehberi

## ⚠️ ÖNEMLİ: Next.js Sunucusu Çalışmalı!

404 ve CORS hatalarının nedeni: **Next.js sunucusu çalışmıyor**

## 📋 Adım Adım Başlatma

### 1. Yeni Terminal Açın
- VS Code'da yeni terminal açın (Terminal → New Terminal)
- Veya PowerShell/CMD açın

### 2. Proje Dizinine Gidin
```bash
cd C:\Users\Birader\Desktop\Harita
```

### 3. Next.js Sunucusunu Başlatın
```bash
npm run dev
```

### 4. Beklenen Çıktı
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

**ÖNEMLİ:** "Ready" mesajını görene kadar bekleyin!

### 5. Test Edin
- Eski HTML uygulamanızı Live Server ile açın (`index.html`)
- Harita araması yapın
- Artık çalışmalı! ✅

## 🔍 Kontrol

Sunucu çalışıyorsa şu URL'ler erişilebilir olmalı:
- ✅ `http://localhost:3000` → Next.js ana sayfa
- ✅ `http://localhost:3000/api/proxy/google?endpoint=textsearch&q=test&lat=41&lng=29` → API test

## ⚠️ Sorun Giderme

### Port 3000 Kullanımda
```bash
# Port'u kontrol edin
netstat -ano | findstr :3000

# Eğer kullanımdaysa, farklı port kullanın:
npm run dev -- -p 3001
```
Sonra `script.js`'de `PROXY_URL`'i güncelleyin.

### "next" komutu bulunamıyor
```bash
# Paketleri yeniden yükleyin
npm install
```

### Hata mesajları
- Terminal'deki hata mesajlarını kontrol edin
- `.env.local` dosyası var mı?
- API key'ler doğru mu?

## ✅ Başarı Kriterleri

Sunucu başarıyla çalışıyorsa:
- [x] Terminal'de "Ready" mesajı görünüyor
- [x] `http://localhost:3000` açılıyor
- [x] API route'ları erişilebilir (404 yok)
- [x] CORS hatası yok
- [x] Harita araması çalışıyor

## 💡 İpucu

**İki terminal kullanın:**
1. Terminal 1: Next.js sunucusu (`npm run dev`) - Sürekli çalışmalı
2. Terminal 2: Diğer komutlar için

---

**ÖNEMLİ:** Next.js sunucusu çalışırken terminal'i kapatmayın! Sunucuyu durdurmak için `Ctrl+C` kullanın.

