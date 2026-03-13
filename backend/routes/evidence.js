const express = require("express");
const router = express.Router();
const evidenceStore = require("../database/evidenceStore");

router.get("/", (req, res) => {
    res.json(evidenceStore);
});

router.get("/verify/:id", (req, res) => {
    const evidence = evidenceStore.find(e => e.id == req.params.id);

    if (!evidence) {
        return res.json({ result: "NOT_FOUND" });
    }

    const fs = require("fs");
    const crypto = require("crypto");

    try {
        const fileBuffer = fs.readFileSync(evidence.filepath);

        const newHash = crypto
            .createHash("sha256")
            .update(fileBuffer)
            .digest("hex");

        if (newHash === evidence.sha256) {
             return res.json({ result: "VERIFIED" });
        } else {
             return res.json({ result: "TAMPERED" });
        }

    } catch (err) {
        return res.json({ result: "TAMPERED" });
    }
});

module.exports = router;