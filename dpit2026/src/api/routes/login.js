const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { password } = req.body;
  if (password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  res.json({ apiKey: process.env.API_KEY });
});

module.exports = router;