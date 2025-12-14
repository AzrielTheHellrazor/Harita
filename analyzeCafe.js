// Tek fotoğraf URL'sini GPT-5.1-mini ile analiz eden örnek çağrı
// Gereksinimler: npm install openai dotenv
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { SYSTEM_PROMPT } = require("./prompts");
const { FEW_SHOT_MESSAGES } = require("./fewshot");

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Verilen fotoğraf URL'si için analiz yapar ve JSON döndürür.
 * @param {string} imageUrl
 * @returns {Promise<Object>}
 */
async function analyzeCafeImage(imageUrl) {
    const response = await client.responses.create({
        model: "gpt-4.1",
        response_format: { type: "json_object" },
        input: [
            // 1) Sistem kuralları
            { role: "system", content: [{ type: "text", text: SYSTEM_PROMPT }] },
            // 2) Few-shot örnekleri
            ...FEW_SHOT_MESSAGES,
            // 3) Gerçek kullanıcı isteği
            {
                role: "user",
                content: [
                    { type: "input_image", image_url: imageUrl },
                    { type: "text", text: "Bu fotoğrafı talimatlara göre analiz et ve sadece JSON döndür." }
                ]
            }
        ]
    });

    const jsonText = response?.output?.[0]?.content?.[0]?.text || "{}";
    return JSON.parse(jsonText);
}

// Küçük test
if (require.main === module) {
    const sample = process.argv[2] || "https://ibb.co/8VTJvf7";
    analyzeCafeImage(sample)
        .then((res) => {
            console.log("Analiz sonucu:", res);
        })
        .catch((err) => {
            console.error("Analiz hatası:", err);
        });
}

module.exports = { analyzeCafeImage };
