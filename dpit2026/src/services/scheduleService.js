const { pool } = require('../db/connection');

async function createSchedule({ zone, hour, minute, durationSeconds, daysOfWeek = '*', enabled = true }) {
  const result = await pool.query(
    `INSERT INTO schedules (zone, hour, minute, duration_seconds, days_of_week, enabled)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [zone, hour, minute, durationSeconds, daysOfWeek, enabled]
  );
  return result.rows[0];
}

async function getSchedules() {
  const result = await pool.query(`SELECT * FROM schedules ORDER BY hour, minute`);
  return result.rows;
}

async function getEnabledSchedules() {
  const result = await pool.query(`SELECT * FROM schedules WHERE enabled = true`);
  return result.rows;
}

async function updateSchedule(id, fields) {
  const { zone, hour, minute, durationSeconds, daysOfWeek, enabled } = fields;
  const result = await pool.query(
    `UPDATE schedules
     SET zone = $1, hour = $2, minute = $3, duration_seconds = $4, days_of_week = $5, enabled = $6
     WHERE id = $7
     RETURNING *`,
    [zone, hour, minute, durationSeconds, daysOfWeek, enabled, id]
  );
  return result.rows[0];
}

async function deleteSchedule(id) {
  await pool.query(`DELETE FROM schedules WHERE id = $1`, [id]);
}

module.exports = { createSchedule, getSchedules, getEnabledSchedules, updateSchedule, deleteSchedule };