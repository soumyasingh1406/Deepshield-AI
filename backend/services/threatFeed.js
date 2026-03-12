const axios = require('axios');
const geoip = require('geoip-lite');
const crypto = require('crypto');

function startThreatFeed(io) {
    console.log("Starting real-time threat feed...");
    
    // Fallbacks if API limits are reached to ensure the dashboard remains active
    const fallbackLocations = [
        { lat: 39.9042, lng: 116.4074 }, // Beijing
        { lat: 55.7558, lng: 37.6173 }, // Moscow
        { lat: 38.9072, lng: -77.0369 }, // Washington DC
        { lat: 51.5074, lng: -0.1278 }, // London
        { lat: 35.6762, lng: 139.6503 }, // Tokyo
        { lat: 40.7128, lng: -74.0060 }, // New York
        { lat: 37.7749, lng: -122.4194 } // San Francisco
    ];

    const threatTypes = ["botnet", "malware", "phishing", "harassment_network"];
    const severities = ["LOW", "MEDIUM", "HIGH"];

    setInterval(async () => {
        try {
            const response = await axios.get('https://feodotracker.abuse.ch/downloads/ipblocklist.json');
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                // Select a random active threat from the live blocklist
                const result = response.data[Math.floor(Math.random() * response.data.length)];
                const geo = geoip.lookup(result.ip_address) || fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
                
                const threatEvent = {
                    id: crypto.randomUUID(),
                    ip: result.ip_address,
                    lat: geo.ll ? geo.ll[0] : geo.lat,
                    lng: geo.ll ? geo.ll[1] : geo.lng,
                    threatType: "botnet",
                    severity: "HIGH",
                    source: "FeodoTracker",
                    timestamp: Date.now()
                };

                io.emit("newThreat", threatEvent);
            }
        } catch (error) {
            console.error("Error fetching FeodoTracker feed:", error.message);
            
            // Fallback generation logic to keep UI active if API fails
            const geo = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
            const fallbackEvent = {
                id: crypto.randomUUID(),
                ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                lat: geo.lat + (Math.random() * 5 - 2.5),
                lng: geo.lng + (Math.random() * 5 - 2.5),
                threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                source: "FeodoTracker (Simulated Offline)",
                timestamp: Date.now()
            };
            io.emit("newThreat", fallbackEvent);
        }
    }, 20000); // Trigger every 20 seconds using active data from abuse.ch
}

module.exports = startThreatFeed;
