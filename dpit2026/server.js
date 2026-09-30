require('dotenv').config();
const app = require('./src/app');
const scheduler = require('./src/jobs/scheduler');
const db = require('./src/db/connection');

const PORT = process.env.PORT || 3000;

db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Sprinkler backend running on port ${PORT}`);
    scheduler.start();
  });
});