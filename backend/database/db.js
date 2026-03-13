const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'deepshield',
    password: process.env.DB_PASSWORD || 'Akanksha@2006',
    port: process.env.DB_PORT || 5432,
});

// Create evidence table if it doesn't exist
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS evidence (
                id VARCHAR(255) PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                filepath VARCHAR(500),
                sha256 VARCHAR(64) NOT NULL,
                risk_level VARCHAR(10) NOT NULL,
                timestamp TIMESTAMPTZ NOT NULL,
                integrity_status VARCHAR(20) DEFAULT 'UNVERIFIED',
                verified_at TIMESTAMPTZ
            )
        `);
        console.log('[DB] Evidence table ready');
    } catch (err) {
        console.error('[DB] Failed to initialize database:', err.message);
    }
};

initDB();

module.exports = pool;