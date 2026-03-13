const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const fs = require("fs");
const { getEvidenceByIdRaw, updateIntegrityStatus } = require("../controllers/evidenceController");

const multer = require("multer");
const upload = multer({ dest: "temp/" });

function calculateHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);
        stream.on("data", data => hash.update(data));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
}

// AUTO-VERIFY: Re-hashes the stored file on disk
// GET /api/evidence/verify/:id
router.get("/:id", async (req, res) => {
    const evidenceId = req.params.id;
    const record = await getEvidenceByIdRaw(evidenceId);

    if (!record) {
        return res.status(404).json({ error: "Evidence record not found", status: "NOT_FOUND" });
    }

    const storedFilePath = record.filepath;

    if (!storedFilePath || !fs.existsSync(storedFilePath)) {
        await updateIntegrityStatus(evidenceId, "MISSING", new Date().toISOString());
        return res.json({ verified: false, status: "MISSING", verifiedAt: new Date().toISOString() });
    }

    try {
        const calculatedHash = await calculateHash(storedFilePath);
        const storedHash = record.sha256;
        const verifiedAt = new Date().toISOString();

        console.log(`\n[Verify] ID: ${evidenceId}`);
        console.log(`[Verify] Stored:  ${storedHash}`);
        console.log(`[Verify] Current: ${calculatedHash}`);
        console.log(`[Verify] Match:   ${calculatedHash === storedHash ? "✅ VERIFIED" : "❌ TAMPERED"}\n`);

        const status = calculatedHash === storedHash ? "VERIFIED" : "TAMPERED";
        await updateIntegrityStatus(evidenceId, status, verifiedAt);
        return res.json({ verified: status === "VERIFIED", status, verifiedAt });
    } catch (err) {
        console.error("[Verify] Error:", err);
        return res.status(500).json({ error: "Verification failed" });
    }
});

router.post("/:id", upload.single("file"), async (req, res) => {
    const evidenceId = req.params.id;
    const record = await getEvidenceByIdRaw(evidenceId);
    if (!record) return res.status(404).json({ error: "Not found", status: "NOT_FOUND" });
    if (!req.file) return res.status(400).json({ error: "No file", status: "MISSING_FILE" });

    try {
        const calculatedHash = await calculateHash(req.file.path);
        fs.unlink(req.file.path, () => { });
        const verifiedAt = new Date().toISOString();
        const status = calculatedHash === record.sha256 ? "VERIFIED" : "TAMPERED";
        await updateIntegrityStatus(evidenceId, status, verifiedAt);
        return res.json({ verified: status === "VERIFIED", status, verifiedAt });
    } catch (err) {
        return res.status(500).json({ error: "Verification failed" });
    }
});

module.exports = router;