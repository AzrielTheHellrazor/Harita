# 🔄 Proxy Migration - main_proxy.js'den Next.js API Routes'a

## ✅ Yapılan Değişiklikler

### 1. Harita Yükseklik Sorunu Düzeltildi
- `MapComponent` artık `fixed inset-0` kullanıyor
- `app/page.tsx` `h-screen` ve `overflow-hidden` kullanıyor
- Harita artık tam ekran görünecek

### 2. Proxy Next.js API Routes'a Taşındı

**Eski Sistem (main_proxy.js):**
- Node.js HTTP server (port 3001)
- `http://localhost:3001/google/textsearch`
- `http://localhost:3001/google/details`
- `http://localhost:3001/google/photo`
- `http://localhost:3001/ai/chat`
- `http://localhost:3001/ai/gemini`

**Yeni Sistem (Next.js API Routes):**
- `/api/proxy/google` - Google Places API
- `/api/proxy/ai` - AI API'leri (OpenAI/Gemini)

### 3. Güvenlik İyileştirmeleri
- ✅ API key'ler artık sadece server-side'da (`process.env`)
- ✅ Client-side'da API key'ler görünmez
- ✅ CORS otomatik yönetiliyor
- ✅ Next.js güvenlik özellikleri aktif

## 📁 Yeni Dosya Yapısı

```
app/
├── api/
│   └── proxy/
│       ├── google/
│       │   └── route.ts      # Google Places API proxy
│       └── ai/
│           └── route.ts       # AI API proxy (OpenAI/Gemini)
├── hooks/
│   └── useProxy.ts            # Proxy hook (client-side)
└── components/
    └── MapComponent.tsx       # Harita bileşeni (düzeltildi)
```

## 🔧 Kullanım

### useProxy Hook'u

```tsx
import { useProxy } from "@/app/hooks/useProxy";

function MyComponent() {
  const { googleTextSearch, googlePlaceDetails, googlePhoto, aiChat } = useProxy();

  // Google Places Text Search
  const searchPlaces = async () => {
    const result = await googleTextSearch({
      q: "cafe",
      lat: "41.0082",
      lng: "28.9784",
      radius: "3000",
      type: "cafe"
    });
    console.log(result);
  };

  // Google Place Details
  const getDetails = async (placeId: string) => {
    const result = await googlePlaceDetails(placeId);
    console.log(result);
  };

  // Google Photo URL
  const photoUrl = googlePhoto("photo_reference_string", "800");

  // AI Chat (OpenAI)
  const chatWithGPT = async () => {
    const result = await aiChat({
      model: "gpt-4.1",
      messages: [{ role: "user", content: "Hello" }]
    }, "openai");
    console.log(result);
  };

  // AI Chat (Gemini)
  const chatWithGemini = async () => {
    const result = await aiChat({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }]
    }, "gemini");
    console.log(result);
  };
}
```

## 🔐 Environment Variables

`.env.local` dosyası oluşturun:

```env
# Google Places API Key
GOOGLE_PLACES_KEY=your_google_places_api_key_here

# OpenAI API Key
GPT5_API_KEY=your_openai_api_key_here
# veya
OPENAI_API_KEY=your_openai_api_key_here

# Gemini API Key (opsiyonel)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📝 Eski Kod'dan Yeni Koda Geçiş

### Eski (script.js):
```javascript
const PROXY_URL = "http://localhost:3001";
const url = `${PROXY_URL}/google/textsearch?q=cafe&lat=41.0082&lng=28.9784`;
```

### Yeni (React Hook):
```tsx
const { googleTextSearch } = useProxy();
const result = await googleTextSearch({
  q: "cafe",
  lat: "41.0082",
  lng: "28.9784"
});
```

## ⚠️ Önemli Notlar

1. **main_proxy.js artık gerekli değil** - Next.js API routes kullanılıyor
2. **Port 3001 artık kullanılmıyor** - Tüm istekler Next.js server üzerinden gidiyor
3. **API key'ler `.env.local` dosyasında** - Git'e commit edilmemeli
4. **Production'da environment variables** - Vercel/Netlify'da ayarlanmalı

## 🚀 Migration Checklist

- [x] Next.js API routes oluşturuldu
- [x] useProxy hook'u oluşturuldu
- [x] Harita yükseklik sorunu düzeltildi
- [ ] Eski script.js'deki proxy çağrıları güncellenmeli
- [ ] main_proxy.js kaldırılabilir (opsiyonel)
- [ ] .env.local dosyası oluşturulmalı
- [ ] Production'da environment variables ayarlanmalı

## 🔄 Sonraki Adımlar

1. Mevcut `script.js` içindeki proxy çağrılarını React hook'larına dönüştürün
2. `.env.local` dosyasını oluşturup API key'leri ekleyin
3. Test edin: `npm run dev`
4. Production'a deploy ederken environment variables'ı ayarlayın

