const express = require('express');
const deviceService = require('../../services/deviceService');
const router = express.Router();

router.get('/', (req, res) => {
  const { zone } = req.query;
  const sensors = deviceService.getSensors(zone);
  if (!sensors) return res.status(404).json({ error: 'No sensor reading yet for this zone.' });
  res.json(sensors);
});

module.exports = router;
