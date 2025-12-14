# 🔐 Environment Variables Kurulumu

## ✅ Tamamlandı

`.env.local` dosyası oluşturuldu ve doğru formata getirildi:

```env
NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_API_KEY=b35cc6e9-44ed-43b1-8472-e68c96754139
GOOGLE_PLACES_KEY=AIzaSyAqA3OP9DEn6HwHJwBI6RWXCuQ2PVq9z20
GPT5_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSyDdoDAK51J_EODkTqnRxHyACnpF25VEm8U
```

## 📋 Environment Variables Açıklamaları

### `NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_API_KEY`
- **Kullanım:** Base Mini App için Coinbase Developer Platform API key
- **Görünürlük:** Public (client-side'da kullanılabilir)
- **Kaynak:** [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

### `GOOGLE_PLACES_KEY`
- **Kullanım:** Google Places API için API key
- **Görünürlük:** Private (sadece server-side)
- **Endpoint:** `/api/proxy/google`
- **Kaynak:** [Google Cloud Console](https://console.cloud.google.com/)

### `GPT5_API_KEY`
- **Kullanım:** OpenAI ChatGPT API için API key
- **Görünürlük:** Private (sadece server-side)
- **Endpoint:** `/api/proxy/ai?provider=openai`
- **Alternatif:** `OPENAI_API_KEY` de kullanılabilir
- **Kaynak:** [OpenAI Platform](https://platform.openai.com/)

### `GEMINI_API_KEY`
- **Kullanım:** Google Gemini AI API için API key
- **Görünürlük:** Private (sadece server-side)
- **Endpoint:** `/api/proxy/ai?provider=gemini`
- **Kaynak:** [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔄 Sunucuyu Yeniden Başlatma

Environment variables değişikliklerinin etkili olması için Next.js sunucusunu yeniden başlatmanız gerekir:

```bash
# Mevcut sunucuyu durdurun (Ctrl+C)
# Sonra yeniden başlatın:
npm run dev
```

## 🧪 Test Etme

### Google Places API Testi:
```bash
curl "http://localhost:3000/api/proxy/google?endpoint=textsearch&q=cafe&lat=41.0082&lng=28.9784"
```

### AI API Testi:
```bash
curl -X POST "http://localhost:3000/api/proxy/ai?provider=openai" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4.1","messages":[{"role":"user","content":"Hello"}]}'
```

## 🔒 Güvenlik Notları

1. ✅ `.env.local` dosyası `.gitignore` içinde - Git'e commit edilmeyecek
2. ✅ API key'ler sadece server-side'da kullanılıyor
3. ✅ Client-side'da API key'ler görünmez
4. ⚠️ Production'da environment variables'ı Vercel/Netlify'da ayarlayın

## 🚀 Production Deployment

Vercel'e deploy ederken:
1. Vercel Dashboard → Project Settings → Environment Variables
2. Her bir key'i ekleyin:
   - `GOOGLE_PLACES_KEY`
   - `GPT5_API_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_API_KEY`

Netlify'e deploy ederken:
1. Netlify Dashboard → Site Settings → Environment Variables
2. Aynı key'leri ekleyin

## ✅ Kontrol Listesi

- [x] `.env.local` dosyası oluşturuldu
- [x] Tüm API key'ler eklendi
- [x] Environment variable isimleri düzeltildi
- [ ] Next.js sunucusu yeniden başlatıldı
- [ ] Proxy API'leri test edildi
- [ ] Harita çalışıyor mu kontrol edildi

## 🐛 Sorun Giderme

### API key'ler çalışmıyor:
1. Sunucuyu yeniden başlattınız mı? (`npm run dev`)
2. `.env.local` dosyası proje kök dizininde mi?
3. Environment variable isimleri doğru mu? (büyük harf, alt çizgi)

### CORS hatası:
- Next.js API routes otomatik CORS yönetiyor
- Eğer hala sorun varsa, `route.ts` dosyalarında CORS header'larını kontrol edin

### 500 Internal Server Error:
- API key'lerin doğru olduğundan emin olun
- Server console'da hata mesajlarını kontrol edin
- `.env.local` dosyasının doğru formatta olduğundan emin olun

