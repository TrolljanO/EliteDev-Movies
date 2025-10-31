import dotenv from 'dotenv';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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

export default auth;
