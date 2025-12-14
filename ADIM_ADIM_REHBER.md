# 🚀 Base Mini App'e Dönüştürme - Adım Adım Rehber

Bu rehber, mevcut HTML/JS harita uygulamanızı Base Mini App'e dönüştürmek için gereken tüm adımları içerir.

## 📋 Genel Bakış

Base Mini App, Base blockchain üzerinde çalışan ve Smart Wallet ile otomatik bağlanan uygulamalardır. Kullanıcıların gas ücreti ödemeden işlem yapmasını sağlar.

## ✅ Tamamlanan Adımlar

### 1. ✅ Next.js Projesi Oluşturuldu
- TypeScript desteği eklendi
- Tailwind CSS yapılandırıldı
- App Router yapısı kuruldu

### 2. ✅ MiniKit Entegrasyonu
- `MiniKitProvider` bileşeni eklendi (`app/components/MiniKitProvider.tsx`)
- Smart Wallet desteği aktif
- Base chain yapılandırması tamamlandı

### 3. ✅ Temel Hook'lar Oluşturuldu
- `useSmartWallet` - Wallet bağlantısı için
- `usePaymaster` - Gasless işlemler için

## 🔧 Şimdi Yapmanız Gerekenler

### Adım 1: Paketleri Yükleyin

Terminal'de şu komutu çalıştırın:

```bash
npm install
```

Bu komut tüm gerekli paketleri yükleyecektir:
- Next.js ve React
- MiniKit (@coinbase/onchainkit)
- Wagmi ve Viem (blockchain işlemleri için)
- Leaflet (harita için)

### Adım 2: Coinbase Developer Platform API Key Alın

1. **Hesap Oluşturun:**
   - [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) adresine gidin
   - Hesap oluşturun veya giriş yapın

2. **Mini App Oluşturun:**
   - Dashboard'da "Create Mini App" butonuna tıklayın
   - Uygulama adını girin: "Harita Uygulamasi"
   - Base network'ü seçin

3. **API Key'i Kopyalayın:**
   - Oluşturduğunuz Mini App'in ayarlarına gidin
   - API Key'i kopyalayın

### Adım 3: Environment Variables Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_API_KEY=buraya_api_key_yapistirin
```

**Önemli:** `.env.local` dosyası `.gitignore` içinde olduğu için Git'e commit edilmeyecek (güvenlik için).

### Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

**Beklenen Sonuç:**
- Harita görünmeli
- Sağ üst köşede wallet adresi görünmeli (Base App içinde açıldığında)
- Konsol'da hata olmamalı

### Adım 5: Base App'te Test Edin

1. **Base App'i İndirin:**
   - iOS: App Store'dan "Base" uygulamasını indirin
   - Android: Google Play'den "Base" uygulamasını indirin

2. **Mini App Oluşturun:**
   - Base App içinde "Create Mini App" seçeneğini bulun
   - Veya web URL'nizi Base App'e ekleyin

3. **Test Edin:**
   - Mini App açıldığında otomatik olarak Smart Wallet bağlanmalı
   - Login butonu görünmemeli (Mini App'lerde gerekmez)

## 🎯 Sonraki Adımlar (Opsiyonel)

### Mevcut HTML/JS Kodunu React'e Dönüştürme

Şu anda sadece temel harita bileşeni React'e dönüştürüldü. Tüm uygulamayı dönüştürmek için:

1. **Bileşenlere Ayırın:**
   - `app/components/FilterPanel.tsx` - Filtre paneli
   - `app/components/EventPanel.tsx` - Etkinlik paneli
   - `app/components/ProfilePanel.tsx` - Profil paneli
   - `app/components/DetailPanel.tsx` - Detay paneli

2. **State Yönetimi:**
   - `script.js` içindeki global state'leri React hooks'a çevirin
   - `useState` ve `useEffect` kullanın

3. **Onchain İşlemler Ekleyin:**
   - Etkinlik oluşturma → Blockchain'e kaydet
   - Yorum yapma → NFT minting
   - Token ödülleri

### Paymaster Entegrasyonu (Gasless İşlemler)

`app/hooks/usePaymaster.ts` hook'u hazır. Kullanım örneği:

```tsx
import { usePaymaster } from "@/app/hooks/usePaymaster";

function MyComponent() {
  const { sendGaslessTransaction, isPending } = usePaymaster();

  const handleClick = async () => {
    try {
      await sendGaslessTransaction("0x...", "0.001"); // 0.001 ETH gönder
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Gönderiliyor..." : "Gasless İşlem Gönder"}
    </button>
  );
}
```

## 📁 Proje Yapısı

```
Harita/
├── app/
│   ├── components/
│   │   ├── MiniKitProvider.tsx    # MiniKit provider
│   │   └── MapComponent.tsx       # Harita bileşeni
│   ├── hooks/
│   │   ├── useSmartWallet.ts      # Wallet hook
│   │   └── usePaymaster.ts        # Paymaster hook
│   ├── layout.tsx                 # Ana layout
│   ├── page.tsx                   # Ana sayfa
│   └── globals.css                # Global stiller
├── package.json                   # Paket bağımlılıkları
├── tsconfig.json                  # TypeScript config
├── next.config.js                 # Next.js config
└── .env.local                     # Environment variables (oluşturulacak)
```

## 🐛 Sorun Giderme

### Paket Yükleme Hataları

```bash
# Node modules'ü temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Hataları

```bash
# TypeScript kontrolü
npx tsc --noEmit
```

### Build Hataları

```bash
# Build'i test et
npm run build
```

### Wallet Bağlanmıyor

1. `.env.local` dosyasında API key'in doğru olduğundan emin olun
2. Base App içinde açıldığından emin olun (normal tarayıcıda çalışmayabilir)
3. Console'da hata mesajlarını kontrol edin

## 📚 Kaynaklar

- [Base Mini App Dokümantasyonu](https://docs.base.org/cookbook/converting-customizing-mini-apps)
- [OnchainKit Dokümantasyonu](https://onchainkit.xyz/)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Base Chain Dokümantasyonu](https://docs.base.org/)

## ✅ Kontrol Listesi

- [ ] `npm install` çalıştırıldı
- [ ] `.env.local` dosyası oluşturuldu ve API key eklendi
- [ ] `npm run dev` ile sunucu başlatıldı
- [ ] Localhost'ta uygulama açılıyor
- [ ] Base App'te test edildi
- [ ] Wallet otomatik bağlanıyor
- [ ] Login butonu görünmüyor (doğru!)

## 💡 İpuçları

1. **Mini App'lerde login butonu olmamalı** - Smart Wallet otomatik bağlanır
2. **Base App içinde test edin** - Normal tarayıcıda bazı özellikler çalışmayabilir
3. **Gasless işlemler** - Paymaster sayesinde kullanıcılar gas ücreti ödemez
4. **TypeScript kullanın** - Daha az hata ve daha iyi geliştirme deneyimi

## 🎉 Başarı!

Tüm adımları tamamladıysanız, artık Base Mini App'iniz hazır! 

Sonraki adımlar:
- Mevcut HTML/JS kodunu React'e dönüştürün
- Onchain işlemler ekleyin
- Paymaster ile gasless işlemler yapın
- Vercel'e deploy edin

Sorularınız için Base dokümantasyonunu veya Discord topluluğunu ziyaret edin!

