const { pool } = require('../db/connection');

async function recordEvent({ zone, startedAt, durationSeconds, flowRateLpm }) {
  const litersUsed = (durationSeconds / 60) * flowRateLpm;
  const result = await pool.query(
    `INSERT INTO watering_events (zone, started_at, duration_seconds, flow_rate_lpm, liters_used)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [zone, startedAt, durationSeconds, flowRateLpm, litersUsed]
  );
  return { id: result.rows[0].id, litersUsed };
}

async function getConsumption(period = 'today') {
  const sinceClause = buildSinceClause(period);
  const result = await pool.query(`
    SELECT COALESCE(SUM(liters_used), 0) AS "totalLiters", COUNT(*) AS "eventCount"
    FROM watering_events ${sinceClause}
  `);
  const row = result.rows[0];
  return {
    period,
    totalLiters: Math.round(Number(row.totalLiters) * 10) / 10,
    eventCount: Number(row.eventCount),
  };
}

async function getConsumptionByZone(period = 'today') {
  const sinceClause = buildSinceClause(period);
  const result = await pool.query(`
    SELECT zone, SUM(liters_used) AS "totalLiters", COUNT(*) AS "eventCount"
    FROM watering_events ${sinceClause}
    GROUP BY zone ORDER BY "totalLiters" DESC
  `);
  return result.rows.map(r => ({
    zone: r.zone,
    totalLiters: Math.round(Number(r.totalLiters) * 10) / 10,
    eventCount: Number(r.eventCount),
  }));
}

async function getHistory(limit = 20) {
  const result = await pool.query(
    `SELECT id, zone, started_at, duration_seconds, liters_used
     FROM watering_events ORDER BY started_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

function buildSinceClause(period) {
  switch (period) {
    case 'today': return `WHERE started_at >= date_trunc('day', now())`;
    case 'week': return `WHERE started_at >= now() - interval '7 days'`;
    case 'month': return `WHERE started_at >= now() - interval '1 month'`;
    default: return '';
  }
}

module.exports = { recordEvent, getConsumption, getConsumptionByZone, getHistory };