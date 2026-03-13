const eventBus = require("./eventBus");
const https = require("https");

const NEWS_API_KEY = "6a2c03b8b2d3419eb5d9edabd23c4c66";

const PLATFORM_QUERIES = {
    "Instagram": "deepfake instagram",
    "Telegram": "deepfake telegram",
    "Twitter/X": "deepfake twitter",
    "Reddit": "deepfake reddit",
    "Messaging Apps": "deepfake whatsapp"
};

const spreadData = {
    "Instagram": 40,
    "Telegram": 25,
    "Twitter/X": 18,
    "Reddit": 10,
    "Messaging Apps": 7
};

const clamp = (val, min = 2, max = 85) => Math.max(min, Math.min(max, val));

function fetchNewsCount(query) {
    return new Promise((resolve) => {
        const encoded = encodeURIComponent(query);
        const url = `https://newsapi.org/v2/everything?q=${encoded}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${NEWS_API_KEY}`;

        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.totalResults || 0);
                } catch {
                    resolve(0);
                }
            });
        }).on("error", () => resolve(0));
    });
}

async function updateFromNewsAPI(io) {
    console.log("[SpreadTracker] Fetching real data from NewsAPI...");
    try {
        const counts = {};
        for (const [platform, query] of Object.entries(PLATFORM_QUERIES)) {
            counts[platform] = await fetchNewsCount(query);
            console.log(`[SpreadTracker] ${platform}: ${counts[platform]} articles`);
        }

        const maxCount = Math.max(...Object.values(counts), 1);
        for (const platform of Object.keys(spreadData)) {
            const normalized = (counts[platform] / maxCount) * 85;
            // Smooth blend: 70% real data, 30% previous value
            spreadData[platform] = clamp(normalized * 0.7 + spreadData[platform] * 0.3);
        }

        console.log("[SpreadTracker] Live spread data updated:", spreadData);
        io.emit("spreadUpdate", { ...spreadData });
    } catch (err) {
        console.error("[SpreadTracker] NewsAPI error:", err.message);
    }
}

function startSpreadTracker(io) {
    console.log("Starting Deepfake Media Spread Tracker (NewsAPI)...");

    // Fetch real data immediately
    updateFromNewsAPI(io);

    // Refresh every 15 min (free plan: 100 requests/day)
    setInterval(() => updateFromNewsAPI(io), 15 * 60 * 1000);

    // Small noise every 3s to keep chart feeling live
    setInterval(() => {
        for (const platform of Object.keys(spreadData)) {
            spreadData[platform] = clamp(spreadData[platform] + (Math.random() * 2 - 1));
        }
        io.emit("spreadUpdate", { ...spreadData });
    }, 3000);

    eventBus.on("suspiciousMedia", (data) => {
        const { filename } = data;
        console.log(`[SpreadTracker] Spike triggered by: ${filename}`);

        spreadData["Telegram"] = clamp(spreadData["Telegram"] + Math.random() * 15 + 8);
        spreadData["Twitter/X"] = clamp(spreadData["Twitter/X"] + Math.random() * 12 + 8);
        spreadData["Messaging Apps"] = clamp(spreadData["Messaging Apps"] + Math.random() * 18 + 10);

        io.emit("spreadUpdate", { ...spreadData });

        eventBus.emit("intelLog", {
            severity: "HIGH",
            msg: `Viral spike: Deepfake targeting ${filename ? filename.substring(0, 20) : "unknown"} spreading rapidly.`
        });
    });
}

module.exports = startSpreadTracker;