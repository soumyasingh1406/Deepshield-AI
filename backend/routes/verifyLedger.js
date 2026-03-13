const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { getEvidenceByIdRaw } = require("../controllers/evidenceController");
const eventBus = require("../services/eventBus");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Store upload locally to process
const upload = multer({ dest: uploadDir });

router.post("/", upload.single("ledger"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No CSV ledger file uploaded" });
    }

    let results = [];
    let tamperDetected = false;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
            // Depending on frontend format, keys might contain spaces or different cases
            // Attempt smart resolution or rely on exact exact format: id,filename,sha256
            const rowId = row.id || row.ID || row.Id;
            const rowSha256 = row.sha256 || row.hash || row['SHA-256 Hash'];
            
            if (!rowId || !rowSha256) {
                return; // Skip invalid rows
            }

            const evidence = getEvidenceByIdRaw(rowId);

            if (!evidence) {
                results.push({ id: rowId, status: "MISSING" });
            } else if (evidence.sha256 === rowSha256) {
                results.push({ id: evidence.id.toString(), status: "VERIFIED" });
            } else {
                results.push({ id: evidence.id.toString(), status: "TAMPERED" });
                tamperDetected = true;
            }
        })
        .on("end", () => {
            // Delete the temp CSV file after reading
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.warn("[VerifyLedger] Failed to delete temp uploaded CSV", err);
            }
            
            // Generate telemetry directly using eventBus to sync with socket
            if (tamperDetected) {
                eventBus.emit("tamperDetected");
            }
            
            res.json(results);
        })
        .on("error", (error) => {
            console.error("[VerifyLedger] CSV parse error:", error);
            res.status(500).json({ error: "Failed to parse CSV ledger" });
        });
});

module.exports = router;
