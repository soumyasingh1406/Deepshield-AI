const pool = require('../database/db');

const addEvidence = async (record) => {
    const { id, filename, filepath, sha256, riskLevel, timestamp } = record;
    try {
        await pool.query(
            `INSERT INTO evidence (id, filename, filepath, sha256, risk_level, timestamp, integrity_status)
             VALUES ($1, $2, $3, $4, $5, $6, 'UNVERIFIED')`,
            [id, filename, filepath || null, sha256, riskLevel, timestamp]
        );
        return record;
    } catch (err) {
        console.error('[DB] Error adding evidence:', err.message);
        throw err;
    }
};

const getEvidence = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, filename, filepath, sha256, risk_level AS "riskLevel",
                    timestamp, integrity_status AS "integrityStatus",
                    verified_at AS "verifiedAt"
             FROM evidence ORDER BY timestamp DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[DB] Error fetching evidence:', err.message);
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const total = await pool.query('SELECT COUNT(*) FROM evidence');
        const high = await pool.query("SELECT COUNT(*) FROM evidence WHERE risk_level = 'HIGH'");
        res.json({
            totalFilesAnalyzed: parseInt(total.rows[0].count),
            highRiskMediaDetected: parseInt(high.rows[0].count),
            evidenceStored: parseInt(total.rows[0].count),
            systemStatus: 'ONLINE'
        });
    } catch (err) {
        console.error('[DB] Dashboard stats error:', err.message);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

const getEvidenceById = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, filename, filepath, sha256, risk_level AS "riskLevel",
                    timestamp, integrity_status AS "integrityStatus",
                    verified_at AS "verifiedAt"
             FROM evidence WHERE id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evidence not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
};

const getEvidenceByIdRaw = async (id) => {
    try {
        const result = await pool.query(
            `SELECT id, filename, filepath, sha256, risk_level AS "riskLevel",
                    timestamp, integrity_status AS "integrityStatus",
                    verified_at AS "verifiedAt"
             FROM evidence WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    } catch (err) {
        console.error('[DB] getEvidenceByIdRaw error:', err.message);
        return null;
    }
};

const updateIntegrityStatus = async (id, status, verifiedAt) => {
    try {
        await pool.query(
            `UPDATE evidence SET integrity_status = $1, verified_at = $2 WHERE id = $3`,
            [status, verifiedAt, id]
        );
    } catch (err) {
        console.error('[DB] Error updating integrity status:', err.message);
        throw err;
    }
};

module.exports = {
    addEvidence,
    getEvidence,
    getDashboardStats,
    getEvidenceById,
    getEvidenceByIdRaw,
    updateIntegrityStatus
};