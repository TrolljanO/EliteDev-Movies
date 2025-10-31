import express from 'express';
import favoritesController from '../controllers/favoritesController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', favoritesController.getFavorites);

router.post('/', favoritesController.addFavorite);

router.delete('/:movieId', favoritesController.removeFavorite);

router.get('/check/:movieId', favoritesController.checkFavorite);

export default router;