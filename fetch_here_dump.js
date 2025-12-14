// Node script: collects HERE Discover results around Istanbul and saves to here_places.json
// Usage:
//   set HERE_API_KEY=YOUR_KEY
//   node fetch_here_dump.js
// Output: here_places.json (array of places)
//
// Notes: Keep total requests reasonable to avoid rate limits.

const fs = require("fs");
const https = require("https");

const API_KEY = process.env.HERE_API_KEY;
if (!API_KEY) {
    console.error("Missing HERE_API_KEY env");
    process.exit(1);
}

const CENTER = { lat: 41.0082, lng: 28.9784 };
const RADIUS = 20000;
const LIMIT = 50;
const QUERIES = ["cafe", "restaurant", "bar", "coffee", "food"];

const GRID = [];
const LAT_OFFSETS = [-0.2, 0, 0.2];
const LNG_OFFSETS = [-0.3, 0, 0.3];
LAT_OFFSETS.forEach((dy) => {
    LNG_OFFSETS.forEach((dx) => {
        GRID.push({ lat: CENTER.lat + dy, lng: CENTER.lng + dx });
    });
});
// Hedef semtler icin ekstra merkezler
const EXTRA_POINTS = [
    { lat: 40.9901, lng: 29.0270 }, // Kadikoy
    { lat: 40.9957, lng: 28.9089 } // Zeytinburnu
];
EXTRA_POINTS.forEach((p) => GRID.push(p));

function httpsJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { accept: "application/json" } }, (res) => {
            let body = "";
            res.on("data", (c) => (body += c));
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body || "{}"));
                } catch (err) {
                    reject(err);
                }
            });
        });
        req.on("error", reject);
        req.setTimeout(5000, () => {
            req.destroy(new Error("timeout"));
        });
    });
}

function normalizeHereItem(item) {
    if (!item) return null;
    const pos = item.position || item.access?.[0];
    if (!pos?.lat || !pos?.lng) return null;
    return {
        id: item.id,
        name: item.title || item.address?.label || "Mekan",
        type: item.categories?.[0]?.name || "Mekan",
        coords: [pos.lat, pos.lng],
        address: item.address?.label || "",
        website: item.contacts?.[0]?.www?.[0]?.value || "",
        hours: "",
        rating: null,
        priceLabel: "",
        tel: item.contacts?.[0]?.phone?.[0]?.value || "",
        photo: "",
        tags: (item.categories || []).map((c) => c.name).slice(0, 3),
        features: [],
        subOptions: {}
    };
}

async function discover(q, lat, lng) {
    const params = new URLSearchParams({
        apikey: API_KEY,
        q,
        in: `circle:${lat},${lng};r=${RADIUS}`,
        limit: LIMIT
    });
    const url = `https://discover.search.hereapi.com/v1/discover?${params.toString()}`;
    return httpsJson(url);
}

(async () => {
    const seen = new Map();
    let attempts = 0;
    for (const { lat, lng } of GRID) {
        for (const q of QUERIES) {
            attempts += 1;
            try {
                const data = await discover(q, lat, lng);
                (data.items || []).forEach((it) => {
                    const p = normalizeHereItem(it);
                    if (p && !seen.has(p.id)) seen.set(p.id, p);
                });
            } catch (err) {
                // swallow errors to keep going
            }
        }
    }
    const all = Array.from(seen.values());
    fs.writeFileSync("here_places.json", JSON.stringify(all, null, 2), "utf8");
    console.log(`Wrote here_places.json with ${all.length} places from ${attempts} attempts`);
})();
