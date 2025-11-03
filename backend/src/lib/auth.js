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
    baseURL: process.env.BETTER_AUTH_URL || "https://elite-dev-movies.vercel.app",
    trustedOrigins: [
        "https://elite-dev-movies.vercel.app",
        "https://elite-dev-movies-gkrwr5m47-trolljano.vercel.app",
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV !== 'production' ? false : {rejectUnauthorized: true},
        crossSubDomainCookies: process.env.NODE_ENV !== 'production' ? false : {rejectUnauthorized: true},
    },
});

export default auth;
