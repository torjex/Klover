const express = require('express');
const scheduleService = require('../../services/scheduleService');
const scheduler = require('../../jobs/scheduler');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await scheduleService.getSchedules());
  } catch (error) {
    next(error); 
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { 
        zone = process.env.DEFAULT_ZONE, hour, minute, durationSeconds, daysOfWeek, enabled 
    } = req.body;
    const schedule = await scheduleService.createSchedule({ zone, hour, minute, durationSeconds, daysOfWeek, enabled });
    scheduler.addOrUpdateTask(schedule);
    res.json(schedule);
  } catch (error) { 
        next(error); 
    }
});

router.put('/:id', async (req, res, next) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    scheduler.addOrUpdateTask(schedule);
    res.json(schedule);
  } catch (error) {
        next(error); 
    }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    scheduler.removeTask(Number(req.params.id));
    res.json({ status: 'deleted' });
  } catch (error) {
        next(error); 
    }
});

module.exports = router;