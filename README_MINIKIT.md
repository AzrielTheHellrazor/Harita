# Base Mini App'e Dönüştürme Rehberi

Bu proje Base Mini App'e dönüştürülmüştür. Aşağıdaki adımları takip edin:

## 📋 Adım Adım Kurulum

### 1. Paketleri Yükleyin

```bash
npm install
```

### 2. Environment Variables Ayarlayın

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Coinbase Developer Platform API Key
# Base App (TBA) için Mini App oluşturduktan sonra alın
NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_API_KEY=your_api_key_here

# Coinbase Developer Platform Schema ID (opsiyonel)
NEXT_PUBLIC_COINBASE_DEVELOPER_PLATFORM_SCHEMA_ID=your_schema_id_here
```

**API Key Nasıl Alınır:**
1. [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) hesabı oluşturun
2. Yeni bir Mini App oluşturun
3. API Key'i kopyalayın ve `.env.local` dosyasına ekleyin

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🔧 Yapılan Değişiklikler

### ✅ Tamamlananlar

1. **Next.js Projesi Oluşturuldu**
   - TypeScript desteği
   - Tailwind CSS
   - App Router yapısı

2. **MiniKit Entegrasyonu**
   - `MiniKitProvider` bileşeni eklendi
   - Smart Wallet desteği
   - Base chain yapılandırması

3. **Temel Yapı**
   - `app/layout.tsx` - Ana layout
   - `app/page.tsx` - Ana sayfa
   - `app/components/MapComponent.tsx` - Harita bileşeni

### 🚧 Yapılacaklar

1. **Mevcut HTML/JS Kodunu React'e Dönüştürme**
   - `script.js` içindeki tüm fonksiyonları React hook'larına dönüştür
   - HTML bileşenlerini React bileşenlerine çevir
   - State yönetimi için React hooks kullan

2. **Onchain İşlemler Ekleme**
   - Etkinlik oluşturma için blockchain işlemi
   - Yorum/Review için NFT minting
   - Token ödülleri

3. **Paymaster Entegrasyonu**
   - Gasless transaction desteği
   - Sponsorlu işlemler

## 📚 Kaynaklar

- [Base Mini App Dokümantasyonu](https://docs.base.org/cookbook/converting-customizing-mini-apps)
- [OnchainKit Dokümantasyonu](https://onchainkit.xyz/)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## 🐛 Sorun Giderme

### Paket Yükleme Hataları
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Hataları
```bash
npm run build
```

### TypeScript Hataları
```bash
npx tsc --noEmit
```

## 📝 Notlar

- Mini App'lerde **login butonu eklenmemelidir** - Smart Wallet otomatik bağlanır
- Base App (TBA) içinde çalışacak şekilde tasarlandı
- Gasless işlemler için Paymaster kullanılacak

