function startTelemetryFeed(io) {
    console.log("Starting real-time system telemetry feed...");

    let harassmentScanned = 12450;
    let incidentsPrevented = 834;
    let evidenceRecords = 412;
    let protectionStatus = 99.8;

    const intelMessages = [
        { msg: "Deepfake harassment attempt detected", severity: "HIGH" },
        { msg: "Suspicious impersonation media flagged", severity: "MEDIUM" },
        { msg: "Malicious botnet cluster identified", severity: "HIGH" },
        { msg: "Evidence secured for victim protection", severity: "LOW" },
        { msg: "Neural engine anomaly scan completed", severity: "LOW" },
        { msg: "Voice synthesis matching signature found", severity: "MEDIUM" },
        { msg: "New threat definitions downloaded", severity: "LOW" },
        { msg: "Synchronizing with global intelligence nodes", severity: "LOW" }
    ];

    setInterval(() => {
        // Simulate normal system load
        harassmentScanned += Math.floor(Math.random() * 5);
        
        // Occasionally increment preventions
        if (Math.random() > 0.7) {
            incidentsPrevented += 1;
        }

        // Rarely increment evidence (matches analyzer save rate)
        if (Math.random() > 0.9) {
            evidenceRecords += 1;
        }

        // Fluctuate protection status slightly
        protectionStatus = 99.0 + (Math.random() * 0.9);

        // Generate a random intel event
        const randomIntel = intelMessages[Math.floor(Math.random() * intelMessages.length)];
        const intelEvent = {
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message: randomIntel.msg,
            severity: randomIntel.severity
        };

        const telemetryData = {
            harassmentScanned,
            incidentsPrevented,
            protectionStatus: protectionStatus.toFixed(2),
            evidenceRecords,
            intelEvent
        };

        io.emit("systemTelemetry", telemetryData);
    }, 5000);
}

module.exports = startTelemetryFeed;
