const express = require('express');
const deviceRoutes = require('./routes/device');
const weatherRoutes = require('./routes/weather');
const statsRoutes = require('./routes/stats');
const scheduleRoutes = require('./routes/schedule');
const sensorRoutes = require('./routes/sensors');

const router = express.Router();

router.use('/water', deviceRoutes);
router.use('/weather', weatherRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/sensors', sensorRoutes);
router.use('/', statsRoutes);

module.exports = router;
