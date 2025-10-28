const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.get('/', favoritesController.getFavorites);

router.post('/', favoritesController.addFavorite);

router.delete('/:movieId', favoritesController.removeFavorite);

router.get('/check/:movieId', favoritesController.checkFavorite);

module.exports = router;