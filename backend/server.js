require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require("http");
const { Server } = require("socket.io");
const startThreatFeed = require("./services/threatFeed");
const startTelemetryFeed = require("./services/telemetryFeed");
const startSpreadTracker = require("./services/spreadTracker");

if (!process.env.GEMINI_API_KEY) {
    console.error("WARNING: GEMINI_API_KEY is missing from .env. Falling back to heuristic metadata analysis models only.");
}

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const analyzeRoute = require("./routes/analyzeMedia");
const evidenceRoute = require("./routes/evidence");
const dashboardRoute = require("./routes/dashboard");
const threatsRoute = require("./routes/threats");
const analyzeMessageRoute = require("./routes/analyzeMessage");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRoute);

app.use("/api/evidence/verify-ledger", require("./routes/verifyLedger"));
app.use("/api/evidence", evidenceRoute);

app.use("/api/dashboard", dashboardRoute);
app.use("/api/threats", threatsRoute);
app.use("/api/analyze-message", analyzeMessageRoute);

// Test AI configuration route
app.get("/api/test-ai", (req, res) => {
    console.log("AI connection requested. Found API KEY starting with:", process.env.GEMINI_API_KEY.substring(0, 4) + "...");
    res.json({ aiConfigured: true });
});

app.get("/", (req, res) => {
    res.send("DeepShield AI backend running");
});

const eventBus = require("./services/eventBus");

startThreatFeed(io);
startTelemetryFeed(io);
startSpreadTracker(io);

eventBus.on("tamperDetected", () => {
    io.emit("systemTelemetry", {
        type: "evidence_tamper_detected",
        timestamp: new Date().toISOString()
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});