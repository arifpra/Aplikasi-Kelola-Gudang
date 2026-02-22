const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'undefined') return fallback;
  return String(value).toLowerCase() === 'true';
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  db: {
    user: process.env.DB_USER || '',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || process.env.DB_DATABASE || '',
    password: process.env.DB_PASSWORD || '',
    port: toNumber(process.env.DB_PORT, 5432),
    ssl: toBoolean(process.env.DB_SSL, false),
  },
};

module.exports = env;
