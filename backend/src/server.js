require('dotenv').config();
const express = require('express');
const { toNodeHandler } = require('better-auth/node');
const auth = require('./lib/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', true);

app.use(cors({
    origin: (origin, callback) => {
        const origins = []
          .concat((process.env.BETTER_AUTH_URL || 'http://localhost:3001').split(','))
          .concat((process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(','))
          .map((s) => s.trim());
        if (!origin || origins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', toNodeHandler(auth));

app.get('/', (req, res) => {
    res.json({
        message: 'Movies Library API',
        version: '1.0.0',
        status: 'Running',
    });
});

const favoritesRoutes = require('./routes/favorites');
app.use('/api/favorites', favoritesRoutes);

const tmdbRoutes = require('./routes/tmdb');
app.use('/api/tmdb', tmdbRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Auth origin: ${process.env.BETTER_AUTH_URL || ''}`);
});