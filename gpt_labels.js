(function () {
    const LABEL_CACHE_KEY = "placeLabelsCache_v3";
    const LEGACY_CACHE_KEYS = ["placeLabelsCache_v1", "placeLabelsCache_v2"];
    const ENABLE_CACHE = false; // cache disabled for now; keep switch for future re-enable
    const labelCache = {};
    const SYSTEM_PROMPT_PATH = "system prompt.txt";
    let systemPromptCache = "";
    let systemPromptPromise = null;

    function loadLabelCache() {
        // wipe any previously stored caches so older labels don't get reused
        try {
            LEGACY_CACHE_KEYS.forEach((k) => localStorage.removeItem(k));
            localStorage.removeItem(LABEL_CACHE_KEY);
        } catch {
            // ignore
        }
    }

    function persistLabelCache() {
        // cache writes disabled intentionally
    }

    async function fetchDataUrl(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("photo fetch failed");
            const blob = await res.blob();
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch {
            return null;
        }
    }

    async function getPlacePhotoUrls(place) {
        const urls = [];
        if (place?.photo) urls.push(place.photo);
        if (Array.isArray(place?.photos)) {
            place.photos.forEach((u) => {
                if (u && !urls.includes(u)) urls.push(u);
            });
        }

        const unique = Array.from(new Set(urls)); // tum fotolari kullan
        const converted = [];
        for (const u of unique) {
            if (!u) continue;
            if (u.startsWith("data:")) {
                converted.push(u);
                continue;
            }
            const dataUrl = await fetchDataUrl(u);
            converted.push(dataUrl || u);
        }
        // Debug: GPT'ye giden foto sayisini goster
        console.log("[AI photos]", { count: converted.length, sample: converted.slice(0, 2) });
        return converted;
    }

    async function ensureSystemPrompt() {
        if (systemPromptCache) return systemPromptCache;
        if (systemPromptPromise) return systemPromptPromise;
        const promptUrl = encodeURI(SYSTEM_PROMPT_PATH);
        systemPromptPromise = fetch(promptUrl)
            .then((res) => (res.ok ? res.text() : ""))
            .then((text) => (text || "").trim())
            .catch(() => "")
            .then((text) => {
                systemPromptCache = text;
                if (text && typeof window !== "undefined") {
                    window.GPT5_PROMPT = text;
                }
                return systemPromptCache;
            })
            .finally(() => {
                systemPromptPromise = null;
            });
        return systemPromptPromise;
    }

    function getBasePrompt() {
        return (
            systemPromptCache ||
            window.GPT5_PROMPT ||
            "Asagidaki mekan bilgisine gore 3-6 adet kisa etiket uret. Sadece etiketleri virgulle ayirarak don."
        );
    }

    function buildPrompt(place, photos = []) {
        const basePrompt = getBasePrompt();
        const payload = {
            id: place.id,
            name: place.name,
            type: place.type,
            address: place.address || "",
            tags: place.tags || [],
            features: place.features || [],
            coords: place.coords,
            photos
        };
        return `${basePrompt}\nMekan verisi: ${JSON.stringify(payload)}`;
    }

    function buildGptMessages(prompt, photos) {
        const hasImages = Array.isArray(photos) && photos.length;
        if (!hasImages) return [{ role: "user", content: prompt }];

        const imageParts = photos.slice(0, 3).map((url) => ({
            type: "image_url",
            image_url: { url }
        }));

        return [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    ...imageParts
                ]
            }
        ];
    }

    let aiBlockReason = "";
    let aiToastShown = false;

    function notifyAiError(message) {
        if (!aiToastShown && typeof showToast === "function") {
            showToast(message);
            aiToastShown = true;
        }
        console.warn(message);
    }

    const AI_PROXY_URL = (typeof window !== "undefined" && window.AI_PROXY_URL) || "http://localhost:3001";

    async function callGpt5(prompt, photos = []) {
        const body = {
            model: "gpt-4.1", // OpenAI GPT-4.1
            messages: buildGptMessages(prompt, photos)
        };
        console.log("[AI request]", {
            photoCount: photos.length,
            hasImages: !!(body.messages?.[0]?.content || []).find((c) => c.type === "image_url")
        });
        const res = await fetch(`${AI_PROXY_URL}/ai/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const text = await res.text();
            if (res.status === 401 || res.status === 403) {
                aiBlockReason = "gpt_forbidden";
                notifyAiError("GPT anahtari reddedildi (401/403). Gecerli bir anahtar gir.");
            }
            throw new Error(`gpt5_error:${res.status}:${text}`);
        }
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content || "";
        return content;
    }

    async function callGemini(prompt) {
        const body = {
            contents: [{ parts: [{ text: prompt }] }]
        };
        const res = await fetch(`${AI_PROXY_URL}/ai/gemini`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const text = await res.text();
            if (res.status === 401 || res.status === 403 || res.status === 404) {
                aiBlockReason = "gemini_forbidden";
                notifyAiError("Gemini anahtari/endpoint hatasi (4xx). Gecerli bir anahtar gir.");
            }
            throw new Error(`gemini_error:${res.status}:${text}`);
        }
        const json = await res.json();
        const content = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return content;
    }

    function normalizeFromJson(obj) {
        if (!obj || typeof obj !== "object") return { labels: [], clears: [] };
        const clears = [];
        const labels = [];
        const isik = (obj.mekan_isiklandirma || "").toLowerCase();
        if (isik === "los") labels.push("Los");
        else if (isik === "dogal") labels.push("Dogal");
        else if (isik === "canli") labels.push("Canli");
        else if ("mekan_isiklandirma" in obj) clears.push("Isiklandirma");

        if (obj.ambiyans && typeof obj.ambiyans === "object") {
            if (obj.ambiyans.retro) labels.push("Retro");
            if (obj.ambiyans.modern) labels.push("Modern");
            if (obj.ambiyans.retro === false && obj.ambiyans.modern === false) clears.push("Ambiyans");
        } else if ("ambiyans" in obj) {
            clears.push("Ambiyans");
        }

        if (obj.masada_priz_var_mi) labels.push("Masada priz");
        else if (obj.masada_priz_var_mi === false) clears.push("Priz");

        if (obj.koltuk_var_mi) labels.push("Koltuk var");
        else if (obj.koltuk_var_mi === false) clears.push("Oturma");

        if (obj.sigara_iciliyor) {
            labels.push("Sigara icilebilir");
            const alan = Array.isArray(obj.sigara_alani) ? obj.sigara_alani.map((x) => (x || "").toLowerCase()) : [];
            if (alan.includes("kapali")) labels.push("Kapali alanda sigara icilebilir");
        } else if (obj.sigara_iciliyor === false || ("sigara_alani" in obj && Array.isArray(obj.sigara_alani) && !obj.sigara_alani.length)) {
            clears.push("Sigara");
        }

        if (obj.deniz_manzarasi) labels.push("Deniz goruyor");
        else if (obj.deniz_manzarasi === false) clears.push("Deniz");

        return { labels: Array.from(new Set(labels)).slice(0, 12), clears: Array.from(new Set(clears)) };
    }

    function parseLabels(text) {
        if (!text) return [];
        const trimmed = text.trim();
        // Try JSON parse (supports code fences)
        const jsonCandidate = trimmed
            .replace(/^```json/i, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();
        try {
            const obj = JSON.parse(jsonCandidate);
            const res = normalizeFromJson(obj);
            if (res.labels.length || res.clears.length) return res;
        } catch {
            // fall through
        }
        // Fallback to legacy comma/line-based labels
        const cleaned = trimmed.replace(/\n/g, ",");
        return {
            labels: cleaned
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 8),
            clears: []
        };
    }

    async function fetchLabelsForPlace(place) {
        // Clear previous block so yeni anahtar/deneme hemen devreye girsin
        aiBlockReason = "";
        aiToastShown = false;

        await ensureSystemPrompt();
        const photos = await getPlacePhotoUrls(place);
        const prompt = buildPrompt(place, photos);
        let content = "";
        let modelUsed = "";
        try {
            content = await callGpt5(prompt, photos);
            modelUsed = "gpt5";
        } catch (err) {
            // fallback to gemini in all failure cases (rate limit, missing key, etc.)
            try {
                content = await callGemini(prompt);
                modelUsed = "gemini";
            } catch (err2) {
                aiBlockReason = aiBlockReason || err2.message || "ai_failed";
                throw err2;
            }
        }
        const parsed = parseLabels(content);
        return { labels: parsed.labels || [], clears: parsed.clears || [], modelUsed, raw: content };
    }

    async function ensurePlaceLabels(place) {
        if (!place?.id) return;
        if (ENABLE_CACHE && labelCache[place.id]?.labels?.length) return;
        const photoUrls = await getPlacePhotoUrls(place);
        const record = { urls: photoUrls, labels: [], model: "", updatedAt: Date.now() };
        if (ENABLE_CACHE) {
            labelCache[place.id] = record;
            persistLabelCache();
        }
        try {
            const res = await fetchLabelsForPlace(place);
            record.labels = res.labels;
            record.clears = res.clears || [];
            record.model = res.modelUsed;
            record.raw = res.raw;
            record.updatedAt = Date.now();
            // ensure urls persisted
            record.urls = photoUrls;
        } catch (err) {
            record.error = err.message || "label_fetch_failed";
        }
        if (ENABLE_CACHE) {
            labelCache[place.id] = record;
            persistLabelCache();
        }
        return record;
    }

    function getCachedPlaceLabels(placeId) {
        return labelCache[placeId];
    }

    loadLabelCache();

    window.ensurePlaceLabels = ensurePlaceLabels;
    window.getCachedPlaceLabels = getCachedPlaceLabels;
    window.placeLabelCache = labelCache;
})();
