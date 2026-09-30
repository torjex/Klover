const express = require('express');
const weatherService = require('../../services/weatherService');
const router = express.Router();

router.get('/rain-chance', async (req, res, next) => {
  try { res.json(await weatherService.getRainChance()); }
  catch (error) {
     next(error); 
    }
});

router.get('/current', async (req, res, next) => {
  try { res.json(await weatherService.getCurrentConditions()); }
  catch (error) {
        next(error); 
    }
});

module.exports = router;