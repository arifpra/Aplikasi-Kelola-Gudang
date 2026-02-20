const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    user: process.env.DB_USER || '',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || '',
    password: process.env.DB_PASSWORD || '',
    port: toNumber(process.env.DB_PORT, 5432),
  },
};

module.exports = env;
