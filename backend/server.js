require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require("http");
const { Server } = require("socket.io");

const startThreatFeed = require("./services/threatFeed");
const startTelemetryFeed = require("./services/telemetryFeed");
const startSpreadTracker = require("./services/spreadTracker");

const analyzeRoute = require("./routes/analyzeMedia");
const evidenceRoute = require("./routes/evidence");
const dashboardRoute = require("./routes/dashboard");
const threatsRoute = require("./routes/threats");
const analyzeMessageRoute = require("./routes/analyzeMessage");

const eventBus = require("./services/eventBus");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

/* ---------------- Middleware ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- Gemini AI Setup ---------------- */

let genAI = null;

if (!process.env.GEMINI_API_KEY) {
    console.warn(
        "⚠️ GEMINI_API_KEY missing. Falling back to heuristic metadata analysis."
    );
} else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/* ---------------- API Routes ---------------- */

app.use("/api/analyze", analyzeRoute);

app.use("/api/evidence/verify-ledger", require("./routes/verifyLedger"));
app.use("/api/evidence", evidenceRoute);

app.use("/api/dashboard", dashboardRoute);
app.use("/api/threats", threatsRoute);
app.use("/api/analyze-message", analyzeMessageRoute);

/* ---------------- Health Check ---------------- */

app.get("/", (req, res) => {
    res.send("DeepShield AI backend running 🚀");
});

/* ---------------- AI Test Route ---------------- */

app.get("/api/test-ai", (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.json({ aiConfigured: false });
    }

    console.log(
        "AI connection requested. Key detected starting with:",
        process.env.GEMINI_API_KEY.substring(0, 4) + "..."
    );

    res.json({ aiConfigured: true });
});

/* ---------------- Real-Time Feeds ---------------- */

startThreatFeed(io);
startTelemetryFeed(io);
startSpreadTracker(io);

eventBus.on("tamperDetected", () => {
    io.emit("systemTelemetry", {
        type: "evidence_tamper_detected",
        timestamp: new Date().toISOString()
    });
});

/* ---------------- Railway Compatible Port ---------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 DeepShield backend running on port ${PORT}`);
});