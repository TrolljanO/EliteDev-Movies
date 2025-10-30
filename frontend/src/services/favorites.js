import { api } from './http'

export const Favorites = {
  list() {
    return api.get('/api/favorites')
  },
  add(movie) {
    const payload = {
      movieId: String(movie.movieId ?? movie.id),
      movieTitle: movie.movieTitle ?? movie.title,
      moviePosterPath: movie.moviePosterPath ?? movie.posterPath ?? movie.poster_path ?? null,
      movieOverview: movie.movieOverview ?? movie.overview ?? null,
      movieReleaseDate: movie.movieReleaseDate ?? movie.releaseDate ?? movie.release_date ?? null,
    }
    return api.post('/api/favorites', payload)
  },
  check(movieId) {
    return api.get(`/api/favorites/check/${movieId}`)
  },
  remove(movieId) {
    return api.delete(`/api/favorites/${movieId}`)
  },
}
