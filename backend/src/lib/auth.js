require('dotenv').config();
const { betterAuth } = require("better-auth");
const { Pool } = require('pg');

console.log('🔍 Inicializando BetterAuth...');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
    trustedOrigins: [
        "http://localhost:3001",
        "http://localhost:5173",
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    advanced: {
        useSecureCookies: false,
        crossSubDomainCookies: false,
    },
});

module.exports = auth;
