// fetch_istanbul_fsq.js
// Node 18+ kullanıyorsan fetch global, eskiyse 'node-fetch' eklemen gerekir.
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const FSQ_API_KEY = process.env.FOURSQUARE_API_KEY || process.env.FSQ_API_KEY || "";

// İstanbul için kahve/kafe kategorileri
// 13032 = Coffee shop, 13065 = Café vb.
const CATEGORIES = "13032,13065";

const OUT_FILE = path.join(__dirname, "istanbul_fsq_places.json");

if (!FSQ_API_KEY) {
  throw new Error("Missing FOURSQUARE_API_KEY/FSQ_API_KEY environment variable");
}

async function fetchPage(cursor) {
  const params = new URLSearchParams({
    near: "Istanbul",
    radius: "25000",       // 25 km civarı (merkez ağırlıklı)
    categories: CATEGORIES,
    limit: "50",           // her sayfada 50 mekan
    sort: "POPULARITY"
  });
  if (cursor) params.set("cursor", cursor);

  const url = `https://api.foursquare.com/v3/places/search?${params.toString()}`;

  const resp = await fetch(url, {
    headers: {
      "Authorization": FSQ_API_KEY,
      "accept": "application/json"
    }
  });

  if (!resp.ok) {
    throw new Error(`FSQ error ${resp.status}: ${await resp.text()}`);
  }

  return resp.json();
}

async function fetchAll() {
  let all = [];
  let cursor = undefined;
  let page = 1;

  while (true) {
    console.log(`Sayfa ${page} alınıyor...`);
    const data = await fetchPage(cursor);

    all = all.concat(data.results || []);
    cursor = data.context && data.context.next_cursor;

    // cursor yoksa veya çok sayfa olduysa kır
    if (!cursor || page >= 10) break;  // ücretsiz planda abartmamak için

    page++;
  }

  console.log(`Toplam mekan sayısı: ${all.length}`);

  fs.writeFileSync(OUT_FILE, JSON.stringify(all, null, 2), "utf-8");
  console.log("Kaydedildi:", OUT_FILE);
}

fetchAll().catch(err => {
  console.error("Hata:", err);
});
