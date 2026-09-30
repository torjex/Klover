const express = require('express');
const irrigationService = require('../../services/irrigationService');
const deviceService = require('../../services/deviceService');
const router = express.Router();

router.post('/now', async (req, res, next) => {
  try {
    const { zone, durationSeconds } = req.body;
    res.json(await irrigationService.waterNow(zone, durationSeconds));
  } catch (error) {
        next(error); 
    }
});

router.post('/stop', async (req, res, next) => {
  try {
    const { zone } = req.body;
    res.json(await irrigationService.stopNow(zone));
  } catch (error) {
        next(error); 
    }
});

router.get('/status', (req, res) => {
  const { zone } = req.query;
  res.json(deviceService.getStatus(zone));
});

module.exports = router;