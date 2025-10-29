import { api } from './http'

export const Favorites = {
  list() {
    return api.get('/api/favorites')
  },
  add(movie) {
    // movie: { movieId, title, posterPath, ... }
    return api.post('/api/favorites', movie)
  },
  check(movieId) {
    return api.get(`/api/favorites/check/${movieId}`)
  },
  remove(movieId) {
    return api.delete(`/api/favorites/${movieId}`)
  },
}
