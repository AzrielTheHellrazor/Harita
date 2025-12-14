const http = require("http");
const https = require("https");
const { URL } = require("url");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// --- API KEY LOADING ---
// Keys must be provided via environment variables; no fallback file is used.
const HERE_API_KEY = process.env.HERE_API_KEY || "";
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY || "";

const HOST = process.env.PROXY_HOST || "127.0.0.1";
const PORT = Number(process.env.PROXY_PORT || 3003);

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

// --- FOURSQUARE HANDLERS ---
async function handleFoursquareSearch(reqUrl, res) {
    if (!FOURSQUARE_API_KEY) return sendJson(res, 500, { error: "missing_foursquare_api_key" });

    const ll = reqUrl.searchParams.get("ll");
    const query = reqUrl.searchParams.get("query");
    if (!ll || !query) return sendJson(res, 400, { error: "missing_ll_or_query_param" });

    const params = new URLSearchParams({ ll, query, limit: 1, radius: 100 });
    const url = `https://api.foursquare.com/v3/places/search?${params.toString()}`;
    
    try {
        console.log("Proxying to Foursquare Search:", url);
        const options = { headers: { Authorization: FOURSQUARE_API_KEY, Accept: "application/json" } };
        const result = await httpsGetJson(url, options);
        
        console.log("---- Foursquare Search Response ----\n", JSON.stringify(result.json, null, 2), "\n----------------------------------");

        sendJson(res, result.status, result.json);
    } catch (err) {
        console.error("Foursquare search proxy error:", err);
        sendJson(res, 502, { error: "foursquare_proxy_failed", detail: err.message });
    }
}

async function handleFoursquarePhotos(reqUrl, res) {
    if (!FOURSQUARE_API_KEY) return sendJson(res, 500, { error: "missing_foursquare_api_key" });
    
    const fsq_id = reqUrl.searchParams.get("fsq_id");
    if (!fsq_id) return sendJson(res, 400, { error: "missing_fsq_id_param" });

    const url = `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=5`;

    try {
        console.log("Proxying to Foursquare Photos:", url);
        const options = { headers: { Authorization: FOURSQUARE_API_KEY, Accept: "application/json" } };
        const result = await httpsGetJson(url, options);

        console.log("---- Foursquare Photos Response ----\n", JSON.stringify(result.json, null, 2), "\n----------------------------------");

        sendJson(res, result.status, result.json);
    } catch(err) {
        console.error("Foursquare photos proxy error:", err);
        sendJson(res, 502, { error: "foursquare_proxy_failed", detail: err.message });
    }
}

// --- HERE HANDLERS ---
function buildHereLookupUrl(id) {
    const params = new URLSearchParams({ apikey: HERE_API_KEY, id });
    return `https://lookup.search.hereapi.com/v1/lookup?${params.toString()}`;
}

async function handleHereDetails(reqUrl, res) {
    const id = reqUrl.searchParams.get("id");
    if (!id) return sendJson(res, 400, { error: "missing_id_param" });

    try {
        const lookupUrl = buildHereLookupUrl(id);
        console.log("Proxying to HERE lookup:", lookupUrl);
        const lookup = await httpsGetJson(lookupUrl);
        console.log("---- HERE API Response ----\n", JSON.stringify(lookup.json, null, 2), "\n--------------------------");
        sendJson(res, lookup.status, lookup.json);
    } catch (err) {
        console.error("HERE details proxy error:", err);
        sendJson(res, 502, { error: "here_proxy_failed", detail: err.message });
    }
}

async function handleHereDiscover(reqUrl, res) {
    const q = reqUrl.searchParams.get("q") || "cafe";
    const lat = reqUrl.searchParams.get("lat");
    const lng = reqUrl.searchParams.get("lng");
    const radius = reqUrl.searchParams.get("r") || 1200;
    const limit = reqUrl.searchParams.get("limit") || 80;
    const nextUrl = reqUrl.searchParams.get("next");
    
    if (!lat || !lng) return sendJson(res, 400, { error: "missing_lat_or_lng_params" });

    try {
        const discoverUrl = buildHereDiscoverUrl(q, lat, lng, radius, limit, nextUrl);
        console.log("Proxying to HERE discover:", discoverUrl);
        const resp = await httpsGetJson(discoverUrl);
        sendJson(res, resp.status, resp.json);
    } catch (err) {
        console.error("HERE discover proxy error:", err);
        sendJson(res, 502, { error: "here_proxy_failed", detail: err.message });
    }
}

function buildHereDiscoverUrl(q, lat, lng, radius, limit, nextUrl) {
    if (nextUrl) return nextUrl;
    const params = new URLSearchParams({ apikey: HERE_API_KEY, q });
    params.set("in", `circle:${lat},${lng};r=${radius}`);
    params.set("limit", limit);
    params.set("lang", "tr");
    return `https://discover.search.hereapi.com/v1/discover?${params.toString()}`;
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
    
    switch (reqUrl.pathname) {
        case "/api/foursquare/search":
            return handleFoursquareSearch(reqUrl, res);
        case "/api/foursquare/photos":
            return handleFoursquarePhotos(reqUrl, res);
        case "/api/here/details":
            return handleHereDetails(reqUrl, res);
        case "/api/here/discover":
            return handleHereDiscover(reqUrl, res);
        default:
            console.log(`404 Not Found: ${req.method} ${req.url}`);
            sendJson(res, 404, { error: "not_found" });
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Proxy server running at http://${HOST}:${PORT}`);
    if (!HERE_API_KEY) console.warn("WARNING: HERE_API_KEY is not set.");
    if (!FOURSQUARE_API_KEY) console.warn("WARNING: FOURSQUARE_API_KEY is not set.");
});
