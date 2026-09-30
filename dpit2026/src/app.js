const express = require('express');
const apiRoutes = require('./api');
const loginRoutes = require('./api/routes/login');
const auth = require('./api/middleware/auth');
const errorHandler = require('./api/middleware/errorHandler');

const app = express();

app.use(express.json());
app.use('/api/login', loginRoutes);
app.use('/api', auth, apiRoutes);
app.use(errorHandler);

module.exports = app;