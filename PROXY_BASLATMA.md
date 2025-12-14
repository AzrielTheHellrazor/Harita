# 🚀 main_proxy.js Başlatma Rehberi

## ✅ Sunucu Başlatıldı!

`main_proxy.js` sunucusu arka planda başlatıldı. Port 3001'de çalışıyor.

## 🔍 Kontrol

Sunucu çalışıyorsa şu mesajı görmelisiniz:
```
Proxy server running at http://127.0.0.1:3001
```

## 🧪 Test

1. HTML uygulamanızı Live Server ile açın
2. Harita araması yapın → Artık çalışmalı! ✅

## ⚠️ Sorun Giderme

### Sunucu çalışmıyorsa:

**Manuel başlatma:**
```bash
node main_proxy.js
```

**VEYA PowerShell script ile:**
```powershell
.\start_proxy.ps1
```

### Port 3001 kullanımda:

```bash
# Port'u kontrol edin
netstat -ano | findstr :3001

# Eğer kullanımdaysa, farklı port kullanın:
# main_proxy.js dosyasında PORT değişkenini değiştirin
```

### API Key hatası:

`.env` dosyasında şunlar olmalı:
- `GOOGLE_PLACES_KEY=...`
- `GPT5_API_KEY=...` (AI için)
- `GEMINI_API_KEY=...` (AI için)

## ✅ Başarı Kriterleri

- [x] `main_proxy.js` çalışıyor
- [ ] Port 3001'de dinliyor
- [ ] Harita araması çalışıyor
- [ ] Place detayları çalışıyor
- [ ] Fotoğraflar çalışıyor

## 💡 İpucu

Sunucuyu durdurmak için terminal'de `Ctrl+C` kullanın.

