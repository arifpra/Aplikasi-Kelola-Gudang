const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./modules/iam/auth.routes');
const iamRoutes = require('./modules/iam/iam.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    environment: env.nodeEnv,
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/iam', iamRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
