const express = require("express");
const router = express.Router();
const { getEvidence, addEvidence } = require("../controllers/evidenceController");

router.get("/", getEvidence);

router.post("/", (req, res) => {
    const { filename, sha256, riskLevel, timestamp } = req.body;

    if (!filename || !sha256 || !riskLevel || !timestamp) {
        return res.status(400).json({ error: "Missing required evidence fields" });
    }

    const record = {
        filename,
        sha256,
        riskLevel,
        timestamp
    };

    addEvidence(record);

    res.status(201).json({ 
        success: true, 
        message: "Evidence stored successfully" 
    });
});

module.exports = router;
