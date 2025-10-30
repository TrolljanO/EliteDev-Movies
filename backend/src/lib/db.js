require('dotenv').config();

const { Kysely, PostgresDialect } = require('kysely');
const { Pool } = require('pg');

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined;
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl,
    };

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool(poolConfig)
  })
});

module.exports = db;
