const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const productsRoutes = require('./modules/products/products.routes');
const transactionsRoutes = require('./modules/transactions/transactions.routes');
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

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);

// Backward compatibility sementara untuk frontend lama.
app.use('/products', productsRoutes);
app.use('/transactions', transactionsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
