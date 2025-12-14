const http = require("http");
const https = require("https");
const { URL } = require("url");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// --- API KEY LOADING ---
// Keys must be provided via environment variables; no fallback file is used.
const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY || "";
// Accept both GPT5_API_KEY and OPENAI_API_KEY for compatibility
const GPT5_API_KEY = process.env.GPT5_API_KEY || process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const HOST = process.env.PROXY_HOST || "127.0.0.1";
const PORT = Number(process.env.PROXY_PORT || 3001);

// --- UTILITY FUNCTIONS ---
function setCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function sendJson(res, status, data) {
    setCors(res);
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

function httpsGetJson(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (resp) => {
            let body = "";
            resp.on("data", (chunk) => (body += chunk));
            resp.on("end", () => {
                try {
                    resolve({ status: resp.statusCode || 500, json: JSON.parse(body || "{}") });
                } catch (err) {
                    reject(new Error(`Failed to parse JSON from upstream API: ${err.message}`));
                }
            });
        });
        req.on("error", (err) => reject(new Error(`Upstream API request failed: ${err.message}`)));
        req.end();
    });
}

function httpsPostJson(url, bodyObj, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const body = JSON.stringify(bodyObj || {});
        const req = https.request(
            {
                method: "POST",
                hostname: urlObj.hostname,
                path: urlObj.pathname + urlObj.search,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                    ...headers
                }
            },
            (resp) => {
                let data = "";
                resp.on("data", (chunk) => (data += chunk));
                resp.on("end", () => {
                    try {
                        const json = JSON.parse(data || "{}");
                        resolve({ status: resp.statusCode || 500, json });
                    } catch (err) {
                        reject(new Error(`Failed to parse JSON from upstream API: ${err.message}`));
                    }
                });
            }
        );
        req.on("error", (err) => reject(new Error(`Upstream API request failed: ${err.message}`)));
        req.write(body);
        req.end();
    });
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}

// --- GOOGLE PLACES HANDLERS ---
async function handleGoogleSearch(reqUrl, res) {
    if (!GOOGLE_PLACES_KEY) return sendJson(res, 500, { error: "missing_google_key" });
    const q = reqUrl.searchParams.get("q") || "";
    const lat = reqUrl.searchParams.get("lat");
    const lng = reqUrl.searchParams.get("lng");
    const radius = reqUrl.searchParams.get("radius") || "3000"; // 3km yarıçap
    const type = reqUrl.searchParams.get("type") || "";
    const nextPageToken = reqUrl.searchParams.get("pagetoken") || "";
    if (!lat || !lng || !q) return sendJson(res, 400, { error: "missing_query_or_coords" });
    const params = new URLSearchParams({
        query: q,
        location: `${lat},${lng}`,
        radius,
        key: GOOGLE_PLACES_KEY
    });
    if (type) params.set("type", type);
    if (nextPageToken) params.set("pagetoken", nextPageToken);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
    try {
        const result = await httpsGetJson(url);
        sendJson(res, result.status, result.json);
    } catch (err) {
        console.error("Google search proxy error:", err);
        sendJson(res, 502, { error: "google_search_failed", detail: err.message });
    }
}

async function handleGoogleDetails(reqUrl, res) {
    if (!GOOGLE_PLACES_KEY) return sendJson(res, 500, { error: "missing_google_key" });
    const placeId = reqUrl.searchParams.get("place_id");
    if (!placeId) return sendJson(res, 400, { error: "missing_place_id" });
    const params = new URLSearchParams({
        place_id: placeId,
        fields: "name,formatted_address,formatted_phone_number,website,opening_hours,photos,geometry,types,rating,user_ratings_total,reviews",
        key: GOOGLE_PLACES_KEY
    });
    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
    try {
        const result = await httpsGetJson(url);
        sendJson(res, result.status, result.json);
    } catch (err) {
        console.error("Google details proxy error:", err);
        sendJson(res, 502, { error: "google_details_failed", detail: err.message });
    }
}

async function handleGooglePhoto(reqUrl, res) {
    if (!GOOGLE_PLACES_KEY) return sendJson(res, 500, { error: "missing_google_key" });
    const ref = reqUrl.searchParams.get("ref");
    const maxwidth = reqUrl.searchParams.get("maxwidth") || "800";
    if (!ref) return sendJson(res, 400, { error: "missing_photo_reference" });
    const params = new URLSearchParams({
        photoreference: ref,
        maxwidth,
        key: GOOGLE_PLACES_KEY
    });
    const url = `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`;
    https.get(url, (photoRes) => {
        setCors(res);
        res.writeHead(photoRes.statusCode || 500, photoRes.headers);
        photoRes.pipe(res, { end: true });
    }).on("error", (err) => {
        sendJson(res, 502, { error: "google_photo_failed", detail: err.message });
    });
}

// --- MAIN SERVER & ROUTER ---
const server = http.createServer((req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    
    if (reqUrl.pathname.startsWith("/google/textsearch")) {
        return handleGoogleSearch(reqUrl, res);
    } else if (reqUrl.pathname.startsWith("/google/details")) {
        return handleGoogleDetails(reqUrl, res);
    } else if (reqUrl.pathname.startsWith("/google/photo")) {
        return handleGooglePhoto(reqUrl, res);
    } else if (reqUrl.pathname === "/ai/chat" && req.method === "POST") {
        return handleOpenAiChat(req, res);
    } else if (reqUrl.pathname === "/ai/gemini" && req.method === "POST") {
        return handleGeminiGenerate(req, res);
    }
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    sendJson(res, 404, { error: "not_found" });
});

async function handleOpenAiChat(req, res) {
    if (!GPT5_API_KEY) return sendJson(res, 500, { error: "missing_gpt_key" });
    let body = {};
    try {
        body = await readBody(req);
    } catch (err) {
        return sendJson(res, 400, { error: "invalid_json", detail: err.message });
    }
    const url = "https://api.openai.com/v1/chat/completions";
    try {
        const result = await httpsPostJson(url, body, { Authorization: `Bearer ${GPT5_API_KEY}` });
        sendJson(res, result.status, result.json);
    } catch (err) {
        console.error("OpenAI proxy error:", err);
        sendJson(res, 502, { error: "openai_proxy_failed", detail: err.message });
    }
}

async function handleGeminiGenerate(req, res) {
    if (!GEMINI_API_KEY) return sendJson(res, 500, { error: "missing_gemini_key" });
    let body = {};
    try {
        body = await readBody(req);
    } catch (err) {
        return sendJson(res, 400, { error: "invalid_json", detail: err.message });
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${encodeURIComponent(
        GEMINI_API_KEY
    )}`;
    try {
        const result = await httpsPostJson(url, body);
        sendJson(res, result.status, result.json);
    } catch (err) {
        console.error("Gemini proxy error:", err);
        sendJson(res, 502, { error: "gemini_proxy_failed", detail: err.message });
    }
}

server.listen(PORT, HOST, () => {
    console.log(`Proxy server running at http://${HOST}:${PORT}`);
    if (!GOOGLE_PLACES_KEY) console.warn("WARNING: GOOGLE_PLACES_KEY is not set.");
});
