const eventBus = require("./eventBus");

function startSpreadTracker(io) {
    console.log("Starting real-time Deepfake Media Spread Tracker...");

    // Initial spread data state
    const spreadDataDict = {
        "Instagram": 40,
        "Telegram": 25,
        "Twitter/X": 18,
        "Reddit": 10,
        "Messaging Apps": 7
    };

    // Helper to keep bounds
    const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

    // Emit the spread update via socket
    const broadcastSpread = () => {
        io.emit("spreadUpdate", spreadDataDict);
    };

    setInterval(() => {
        // Randomly adjust platform spreads slightly (-1 to 2 percent)
        for (let platform of Object.keys(spreadDataDict)) {
            // slightly upward drift or occasional reduction
            const delta = (Math.random() * 3) - 1; 
            spreadDataDict[platform] = clamp(spreadDataDict[platform] + delta);
        }

        broadcastSpread();
    }, 3000);

    // Listen to analyzer component emitting an event that a highly suspicious media was detected
    eventBus.on("suspiciousMedia", (data) => {
        const { filename } = data;
        
        console.log(`[SpreadTracker] Suspicious media detected (${filename}). Simulating spread spike...`);

        // Spike specific platforms mimicking rapid viral propagation of manipulated media
        spreadDataDict["Telegram"] = clamp(spreadDataDict["Telegram"] + Math.random() * 20 + 10);
        spreadDataDict["Twitter/X"] = clamp(spreadDataDict["Twitter/X"] + Math.random() * 15 + 10);
        spreadDataDict["Messaging Apps"] = clamp(spreadDataDict["Messaging Apps"] + Math.random() * 25 + 15);
        
        broadcastSpread(); // Immediate update on spike
        
        // Let the telemetry feed know to create an Intel log
        eventBus.emit("intelLog", {
            severity: "HIGH",
            msg: `Viral spike: Deepfake targeting ${filename ? filename.substring(0, 15) : 'unknown'} rapidly spreading.`
        });
    });
}

module.exports = startSpreadTracker;
