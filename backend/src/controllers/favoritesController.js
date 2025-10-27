const db = require('../config/database');

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await db('favorites')
            .where('user_id', userId)
            .orderBy('created_at', 'desc');

        res.json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar favoritos',
            error: error.message
        });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, movieTitle, moviePosterPath, movieOverview, movieReleaseDate } = req.body;

        if (!movieId || !movieTitle) {
            return res.status(400).json({
                success: false,
                message: 'movieId e movieTitle são obrigatórios'
            });
        }

        const existing = await db('favorites')
            .where('user_id', userId)
            .first();

        if (existing) {
            return res.status.json({
                success: false,
                message: 'Filme já foi favoritado'
            });
        }

        const [favorite] = await db('favorites')
            .insert({
                user_id: userId,
                movie_id: movieId,
                movie_title: movieTitle,
                movie_poster_path: moviePosterPath,
                movie_overview: movieOverview,
                movie_release_date: movieReleaseDate
            })
        .returning('*');

        res.status(201).json({
            success: true,
            message: 'Filme adicionado aos favoritos',
            data: favorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao adicionar filme aos favoritos',
            error: error.message
        });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;

        const deleted = await db('favorites')
            .where({ user_id: userId, movie_id: movieId})
            .del();

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorito não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Favorito removido com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao remover favorito',
            error: error.message
        });
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;

        const favorite = await db('favorites')
            .where({ user_id: userId, movie_id: movieId })
            .first();

        return res.json({
            success: true,
            isFavorite: !!favorite,
            favorite: favorite || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar favorito',
            error: error.message
        });
    }
};