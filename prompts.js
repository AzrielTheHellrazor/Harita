// Sistem promptu: fotoğraf analiz kuralları
const SYSTEM_PROMPT = `
Sen bir kafe/mekan fotoğraf analiz asistanısın. Görevin, verilen FOTOĞRAFLARDA sadece kesin olarak gördüğün bilgileri çıkarmaktır.
EMİN OLMADIĞIN HİÇBİR BİLGİ İÇİN ALAN OLUŞTURMA, TAHMİN YAPMA.

ÇIKTI ALANLARI (sadece gördüğün net kanıta göre doldur):
- mekan_isiklandirma: "los" | "canli" | "dogal"
- ambiyans: { "retro": true/false, "modern": true/false }
- masada_priz_var_mi: true
- koltuk_var_mi: true
- sigara_iciliyor: true
- sigara_alani: ["acik", "kapali"]
- deniz_manzarasi: true

KURALLAR:
- Emin değilsen ilgili alanı HİÇ yazma.
- Sigara: sadece kanıt varsa yaz; açık/kapalı alan ayrımını sigara_alani listesinde belirt.
- Loş = düşük ışık; Canlı = parlak/yapay; Doğal = belirgin gün ışığı.
- Ambiyans retro/modern boolean; ikisi de yoksa ambiyans alanını yazma.

ÇIKTI:
Her zaman tek bir JSON nesnesi döndür, JSON dışında hiçbir şey yazma.
`;
şimdi sana bi kaç örnek veriyorum bunları dikkate al ve kurallara göre analiz et.
// Few-shot örnek mesajları: user+assistant diyalogları
// Her örnek: 1 foto + metin uyarısı + beklenen JSON
const FEW_SHOT_MESSAGES = [
    // ============ EXAMPLE 1 ============
    {
        role: "user",
        content: [
            { type: "input_image", image_url: "https://ibb.co/gZR4GN9B" },
            { type: "input_image", image_url: "https://ibb.co/vxyjtkn4" },
            { type: "input_image", image_url: "https://ibb.co/FL616hP1" },
            { type: "input_image", image_url: "https://ibb.co/ZnjvVt4" },
            { type: "input_image", image_url: "https://ibb.co/3yJz6HcY" },
            { type: "input_image", image_url: "https://ibb.co/350kb2n1" },
            { type: "text", text: "Bu fotoğraf bir ÖĞRETİM örneğidir. Kurallara göre analiz et." }
        ]
    },
    {
        role: "assistant",
        content: [
            {
                type: "output_text",
                text: `{
  "mekan_isiklandirma": "los",
  "ambiyans": { "retro": true, "modern": false },
  "sigara_iciliyor": true,
  "sigara_alani": ["kapali"],
  "deniz_manzarasi": false
}`
            }
        ]
    },

    // ============ EXAMPLE 2 ============
    {
        role: "user",
        content: [
            { type: "input_image", image_url: "https://ibb.co/s9nMvFMx" },
            { type: "input_image", image_url: "https://ibb.co/ZpWGcP6g" },
            { type: "input_image", image_url: "https://ibb.co/bg1SM1C7" },
            { type: "input_image", image_url: "https://ibb.co/ksyMcsf4" },
            { type: "input_image", image_url: "https://ibb.co/wFVDcQGQ" },
            { type: "input_image", image_url: "https://ibb.co/4ZhbzpLf" },
            { type: "input_image", image_url: "https://ibb.co/0ySFQWbQ" },
            { type: "text", text: "Bu fotoğraf bir ÖĞRETİM örneğidir. Kurallara göre analiz et." }
        ]
    },
    {
        role: "assistant",
        content: [
            {
                type: "output_text",
                text: `{
  "mekan_isiklandirma": "canli",
  "ambiyans": { "retro": false, "modern": true },
  "masada_priz_var_mi": true,
  "sigara_iciliyor": true,
  "sigara_alani": ["acik"],
  "deniz_manzarasi": false
}`
            }
        ]
    },

    // ============ EXAMPLE 3 ============
    {
        role: "user",
        content: [
            { type: "input_image", image_url: "https://ibb.co/45Nr9kN" },
            { type: "input_image", image_url: "https://ibb.co/8VTJvf7" },
            { type: "input_image", image_url: "https://ibb.co/gbHvLW6x" },
            { type: "input_image", image_url: "https://ibb.co/HjpRZQ8" },
            { type: "input_image", image_url: "https://ibb.co/gb5wSXF2" },
            { type: "input_image", image_url: "https://ibb.co/2YpzMGBP" },
            { type: "text", text: "Bu fotoğraf bir ÖĞRETİM örneğidir. Kurallara göre analiz et." }
        ]
    },
    {
        role: "assistant",
        content: [
            {
                type: "output_text",
                text: `{
  "mekan_isiklandirma": "dogal",
  "ambiyans": { "retro": true, "modern": false },
  "masada_priz_var_mi": true,
  "koltuk_var_mi": true,
  "sigara_iciliyor": true,
  "sigara_alani": ["acik"],
  "deniz_manzarasi": true
}`
            }
        ]
    }
];

module.exports = { FEW_SHOT_MESSAGES };

module.exports = { SYSTEM_PROMPT };
