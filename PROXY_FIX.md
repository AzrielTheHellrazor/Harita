# 🔧 Proxy API Düzeltmeleri

## ✅ Yapılan Değişiklikler

### 1. `script.js` Güncellendi
- `PROXY_URL` artık Next.js API routes'u kullanıyor
- Eski: `http://localhost:3001/google/textsearch`
- Yeni: `http://localhost:3000/api/proxy/google?endpoint=textsearch`

### 2. API Endpoint Formatı Değişti
**Eski Format:**
```
http://localhost:3001/google/textsearch?q=cafe&lat=41&lng=29
http://localhost:3001/google/details?place_id=xxx
http://localhost:3001/google/photo?ref=xxx&maxwidth=800
```

**Yeni Format:**
```
http://localhost:3000/api/proxy/google?endpoint=textsearch&q=cafe&lat=41&lng=29
http://localhost:3000/api/proxy/google?endpoint=details&place_id=xxx
http://localhost:3000/api/proxy/google?endpoint=photo&ref=xxx&maxwidth=800
```

### 3. CORS Desteği Eklendi
- Tüm API route'larına CORS header'ları eklendi
- `Access-Control-Allow-Origin: *`
- `OPTIONS` method desteği eklendi

## 🚀 Kullanım

### Önemli: Next.js Sunucusu Çalışmalı

1. **Next.js sunucusunu başlatın:**
```bash
npm run dev
```

2. **Eski HTML dosyasını açın:**
- Live Server ile `index.html` açabilirsiniz
- Veya Next.js'te `app/page.tsx` kullanın

### script.js Otomatik Algılama

`script.js` artık otomatik olarak Next.js sunucusunu algılıyor:

```javascript
const PROXY_URL = window.location.origin.includes("localhost:3000") 
    ? window.location.origin + "/api/proxy" 
    : "http://localhost:3000/api/proxy";
```

## 🧪 Test

### 1. Next.js Sunucusunu Başlatın
```bash
npm run dev
```

### 2. Tarayıcıda Test Edin

**Eski HTML ile (Live Server):**
- `index.html` dosyasını Live Server ile açın
- Console'da hata olmamalı
- Harita araması çalışmalı

**Next.js ile:**
- [http://localhost:3000](http://localhost:3000) adresine gidin
- Harita görünmeli ve çalışmalı

### 3. API Testi

```bash
# Google Places Text Search
curl "http://localhost:3000/api/proxy/google?endpoint=textsearch&q=cafe&lat=41.0082&lng=28.9784&radius=3000"

# Google Place Details
curl "http://localhost:3000/api/proxy/google?endpoint=details&place_id=ChIJ..."

# Google Photo
curl "http://localhost:3000/api/proxy/google?endpoint=photo&ref=xxx&maxwidth=800"
```

## ⚠️ Sorun Giderme

### CORS Hatası
- ✅ CORS header'ları eklendi
- Next.js sunucusu çalışıyor mu kontrol edin

### 404 Not Found
- Next.js sunucusu çalışıyor mu? (`npm run dev`)
- Port 3000'de mi çalışıyor?
- `.env.local` dosyası var mı?

### API Key Hatası
- `.env.local` dosyasında `GOOGLE_PLACES_KEY` var mı?
- Sunucuyu yeniden başlattınız mı? (environment variables için gerekli)

### Eski HTML Dosyası Çalışmıyor
- Next.js sunucusu çalışıyor olmalı (`localhost:3000`)
- `script.js` otomatik olarak `localhost:3000`'e bağlanacak

## 📝 Notlar

1. **main_proxy.js artık gerekli değil** - Next.js API routes kullanılıyor
2. **Port 3001 kullanılmıyor** - Tüm istekler Next.js (port 3000) üzerinden gidiyor
3. **Environment variables** - `.env.local` dosyasında olmalı
4. **Sunucu yeniden başlatma** - Environment variable değişiklikleri için gerekli

## ✅ Kontrol Listesi

- [x] `script.js` güncellendi
- [x] API endpoint formatı değiştirildi
- [x] CORS desteği eklendi
- [ ] Next.js sunucusu çalışıyor (`npm run dev`)
- [ ] `.env.local` dosyası var ve doğru
- [ ] Test edildi ve çalışıyor

