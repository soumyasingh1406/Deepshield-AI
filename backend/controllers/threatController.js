const getThreats = (req, res) => {
    // Generate simulated stats
    const stats = {
        deepfakeHarassment: Math.floor(Math.random() * 50) + 10,
        syntheticMedia: Math.floor(Math.random() * 40) + 5,
        voiceCloning: Math.floor(Math.random() * 20) + 2,
        impersonationAttacks: Math.floor(Math.random() * 15) + 1
    };

    // Simulated attack locations (lat, lng, and severity)
    const locations = [
        { lat: 40.7128, lng: -74.0060, name: "North America", severity: "HIGH" }, // NY
        { lat: 51.5074, lng: -0.1278, name: "Europe", severity: "MEDIUM" }, // London
        { lat: 35.6895, lng: 139.6917, name: "Asia", severity: "HIGH" }, // Tokyo
        { lat: -23.5505, lng: -46.6333, name: "South America", severity: "LOW" }, // Sao Paulo
        { lat: -33.8688, lng: 151.2093, name: "Australia", severity: "MEDIUM" } // Sydney
    ];

    res.json({
        stats,
        locations
    });
};

module.exports = {
    getThreats
};
