import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import auth from './lib/auth.js';
import favoritesRoutes from './routes/favorites.js';
import tmdbRoutes from './routes/tmdb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', true);

app.use(cors({
    origin: [
        process.env.BETTER_AUTH_URL || 'http://localhost:3001',
        'http://localhost:5173', 'https://elite-dev-movies.vercel.app'
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[INCOMING REQUEST] Method: ${req.method}, Path: ${req.path}`);
  next();
});

app.use('/api/auth', toNodeHandler(auth));

app.get('/', (req, res) => {
    res.json({
        message: 'Movies Library API',
        version: '1.0.0',
        status: 'Running',
    });
});

app.use('/api/favorites', favoritesRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Auth URL (origin): ${process.env.BETTER_AUTH_URL}`);
});