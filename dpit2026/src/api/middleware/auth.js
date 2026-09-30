const API_KEY = process.env.API_KEY;

function auth(req, res, next) {
  const providedKey = req.header('x-api-key');
  if (!providedKey || providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = auth;