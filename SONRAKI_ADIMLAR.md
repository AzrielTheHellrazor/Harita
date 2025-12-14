# 🚀 Şimdi Ne Yapmalısınız? - Adım Adım Rehber

## ✅ Tamamlanan İşlemler

1. ✅ Next.js projesi kuruldu
2. ✅ MiniKit entegrasyonu yapıldı
3. ✅ Proxy API'ler Next.js'e taşındı
4. ✅ Environment variables ayarlandı
5. ✅ Güvenlik iyileştirmeleri yapıldı
6. ✅ `script.js` ve `gpt_labels.js` güncellendi

## 📋 Şimdi Yapmanız Gerekenler

### 1. Next.js Sunucusunu Başlatın ⚠️ ÖNEMLİ

```bash
npm run dev
```

**Beklenen çıktı:**
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 2. Test Edin

#### A) Next.js Uygulaması (Yeni)
- Tarayıcıda [http://localhost:3000](http://localhost:3000) açın
- Harita görünmeli
- Wallet bağlantısı otomatik olmalı (Base App içinde)

#### B) Eski HTML Uygulaması (Mevcut)
- Live Server ile `index.html` dosyasını açın
- Harita araması yapın → Çalışmalı
- AI etiketleme yapın → Çalışmalı

### 3. Kontrol Listesi

- [ ] Next.js sunucusu çalışıyor (`npm run dev`)
- [ ] `.env.local` dosyası var ve doğru
- [ ] [http://localhost:3000](http://localhost:3000) açılıyor
- [ ] Harita görünüyor
- [ ] Google Places araması çalışıyor
- [ ] AI etiketleme çalışıyor

## 🔧 Sorun Giderme

### Sunucu Başlamıyor
```bash
# Port 3000 kullanımda mı kontrol edin
netstat -ano | findstr :3000

# Node modules'ü temizleyip yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Çalışmıyor
1. `.env.local` dosyası var mı?
2. API key'ler doğru mu?
3. Sunucuyu yeniden başlattınız mı? (env değişiklikleri için gerekli)

### CORS Hatası
- Next.js sunucusu çalışıyor olmalı
- Port 3000'de mi çalışıyor?

## 🎯 Sonraki Adımlar (Opsiyonel)

### 1. Mevcut HTML/JS'i React'e Dönüştürme
- `script.js` içindeki fonksiyonları React hook'larına çevirin
- HTML bileşenlerini React bileşenlerine dönüştürün

### 2. Base Mini App'e Deploy
- Vercel'e deploy edin
- Environment variables'ı Vercel'de ayarlayın
- Base App'te test edin

### 3. Production Hazırlığı
- Rate limiting ekleyin
- Error logging yapılandırın
- Monitoring ekleyin

## 📚 Yardımcı Dosyalar

- `ADIM_ADIM_REHBER.md` - Detaylı Türkçe rehber
- `PROXY_FIX.md` - Proxy API düzeltmeleri
- `AI_SECURITY.md` - AI API güvenlik detayları
- `ENV_SETUP.md` - Environment variables kurulumu

## 💡 Hızlı Başlangıç

```bash
# 1. Sunucuyu başlat
npm run dev

# 2. Tarayıcıda aç
# http://localhost:3000

# 3. Test et
# - Harita görünüyor mu?
# - Arama yapabiliyor musunuz?
# - AI etiketleme çalışıyor mu?
```

## ✅ Başarı Kriterleri

- ✅ Next.js sunucusu çalışıyor
- ✅ Harita görünüyor
- ✅ Google Places araması çalışıyor
- ✅ AI etiketleme çalışıyor
- ✅ Hata yok (console'da)

---

**Sorunuz varsa veya bir şey çalışmıyorsa, hata mesajlarını paylaşın!**

