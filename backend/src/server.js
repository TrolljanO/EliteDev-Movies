require('dotenv').config();
const express = require('express');
const { toNodeHandler } = require('better-auth/node');
const auth = require('./lib/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', true);

// Middlewares
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

// Rotas BetterAuth
app.use('/api/auth', toNodeHandler(auth));

// Rota de teste '/'
app.get('/', (req, res) => {
    res.json({
        message: '🎬 Movies Library API',
        version: '1.0.0',
        status: 'Running',
    });
});


// Rotas Favoritos
const favoritesRoutes = require('./routes/favorites');
app.use('/api/favorites', favoritesRoutes);

// Rotas TMDB
const tmdbRoutes = require('./routes/tmdb');
app.use('/api/tmdb', tmdbRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 Auth URL (origin): ${process.env.BETTER_AUTH_URL}`);
});