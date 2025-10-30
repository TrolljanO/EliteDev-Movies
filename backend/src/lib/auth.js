require('dotenv').config();
const { betterAuth } = require("better-auth");
const { Pool } = require('pg');

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined;

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl,
      }
);

const origins = [
  process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
];

const useSecureCookies = process.env.NODE_ENV === 'production';

const auth = betterAuth({
  database: pool,
  emailAndPassword: { enabled: true },
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  trustedOrigins: origins,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies,
    crossSubDomainCookies: false,
  },
});

module.exports = auth;
