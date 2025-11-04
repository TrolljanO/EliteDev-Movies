import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import tmdbRoutes from '../../backend/src/routes/tmdb.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        process.env.BETTER_AUTH_URL || 'http://localhost:3001',
        'http://localhost:5173',
        'https://elite-dev-movies.vercel.app'
    ],
    credentials: true,
}));
app.use(express.json());

app.use('/', tmdbRoutes);

export default (req, res) => app(req, res);
