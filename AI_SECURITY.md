# 🔒 AI API Güvenlik Kontrolü

## ✅ Güvenlik Özellikleri

### 1. API Key Güvenliği ✅
- **API key'ler sadece server-side'da** (`process.env`)
- **Client-side'da görünmez** - Browser'da görülemez
- **Environment variables** - `.env.local` dosyasında (Git'e commit edilmez)

### 2. CORS Desteği ✅
- Tüm AI API route'larına CORS header'ları eklendi
- `Access-Control-Allow-Origin: *`
- `OPTIONS` method desteği eklendi

### 3. Input Validation ✅
- Request body validation eklendi
- Model/messages kontrolü yapılıyor
- Request size limiti: ~100KB (güvenlik için)
- Invalid request'ler reddediliyor

### 4. Error Handling ✅
- Detaylı hata mesajları client'a gönderilmiyor (güvenlik)
- Sadece genel hata mesajları döndürülüyor
- Detaylı hatalar sadece server log'larında

### 5. Prompt Güvenliği ✅
- Prompt'lar server-side'da işleniyor
- Client'tan direkt API'ye istek yok
- API key'ler client'ta görünmüyor

## 🔐 Güvenlik Katmanları

```
Client (Browser)
    ↓
Next.js API Route (/api/proxy/ai)
    ├─ Input Validation ✅
    ├─ CORS Headers ✅
    ├─ API Key (server-side) ✅
    └─ Error Handling ✅
    ↓
External AI API (OpenAI/Gemini)
    ├─ API Key gönderilir ✅
    └─ Response döndürülür ✅
```

## 📋 Güvenlik Kontrol Listesi

- [x] API key'ler server-side'da
- [x] CORS header'ları eklendi
- [x] Input validation eklendi
- [x] Request size limiti eklendi
- [x] Error handling güvenli hale getirildi
- [x] `gpt_labels.js` güncellendi (yeni endpoint)
- [x] Prompt'lar güvenli şekilde gönderiliyor

## ⚠️ Önemli Notlar

### API Key Güvenliği
- ✅ API key'ler `.env.local` dosyasında
- ✅ `.gitignore` içinde (Git'e commit edilmez)
- ✅ Production'da environment variables olarak ayarlanmalı

### Prompt Güvenliği
- ✅ Prompt'lar client'tan server'a gidiyor
- ✅ Server'dan AI API'ye gönderiliyor
- ✅ API key'ler client'ta görünmüyor

### Rate Limiting (Opsiyonel)
Şu anda rate limiting yok. Production'da eklenebilir:
```typescript
// Örnek rate limiting (gelecekte eklenebilir)
const rateLimiter = new Map();
// IP bazlı rate limiting
```

## 🚀 Kullanım

### Güvenli AI API Çağrısı

```javascript
// gpt_labels.js - Güvenli kullanım
const searchParams = new URLSearchParams({ provider: "openai" });
const res = await fetch(`${AI_PROXY_URL}/ai?${searchParams.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        model: "gpt-4.1",
        messages: [...]
    })
});
```

### Endpoint Formatı

**Eski (güvensiz):**
```
POST http://localhost:3001/ai/chat
POST http://localhost:3001/ai/gemini
```

**Yeni (güvenli):**
```
POST http://localhost:3000/api/proxy/ai?provider=openai
POST http://localhost:3000/api/proxy/ai?provider=gemini
```

## 🐛 Sorun Giderme

### CORS Hatası
- ✅ CORS header'ları eklendi
- Next.js sunucusu çalışıyor mu kontrol edin

### API Key Hatası
- `.env.local` dosyasında `GPT5_API_KEY` veya `GEMINI_API_KEY` var mı?
- Sunucuyu yeniden başlattınız mı?

### Validation Hatası
- Request body doğru formatta mı?
- Model ve messages array var mı?
- Request size çok büyük mü? (100KB limit)

## 📝 Production Checklist

Production'a deploy ederken:
- [ ] Environment variables Vercel/Netlify'da ayarlandı
- [ ] API key'ler production'da doğru
- [ ] CORS ayarları kontrol edildi
- [ ] Rate limiting eklendi (opsiyonel)
- [ ] Error logging yapılandırıldı

## ✅ Sonuç

**AI API'leri güvenli bir şekilde yapılandırıldı:**
- ✅ API key'ler server-side'da
- ✅ Prompt'lar güvenli şekilde gönderiliyor
- ✅ Input validation eklendi
- ✅ CORS desteği eklendi
- ✅ Error handling güvenli hale getirildi

