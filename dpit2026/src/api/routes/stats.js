const express = require('express');
const consumptionService = require('../../services/consumptionService');
const router = express.Router();

router.get('/consumption', async (req, res, next) => {
  try { res.json(await consumptionService.getConsumption(req.query.period || 'today')); }
  catch (error) { next(error); }
});

router.get('/consumption/by-zone', async (req, res, next) => {
  try { res.json(await consumptionService.getConsumptionByZone(req.query.period || 'today')); }
  catch (error) { next(error); }
});

router.get('/history', async (req, res, next) => {
  try { res.json(await consumptionService.getHistory(parseInt(req.query.limit) || 20)); }
  catch (error) { next(error); }
});

module.exports = router;