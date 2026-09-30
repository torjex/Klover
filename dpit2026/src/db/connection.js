const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS watering_events (
      id SERIAL PRIMARY KEY,
      zone TEXT NOT NULL,
      started_at TIMESTAMPTZ NOT NULL,
      duration_seconds INTEGER NOT NULL,
      flow_rate_lpm REAL NOT NULL,
      liters_used REAL NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      zone TEXT NOT NULL,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      days_of_week TEXT NOT NULL DEFAULT '*',
      enabled BOOLEAN NOT NULL DEFAULT true
    )
  `);
  console.log('Database ready');
}

module.exports = { pool, init };