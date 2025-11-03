import { api } from './http'

export const TMDb = {
  popular(page = 1) {
    return api.get(`/api/tmdb/popular`, { params: { page } })
  },
  details(id) {
    return api.get(`/api/tmdb/movie/${id}`)
  },
  search(q, page = 1) {
      return api.get('/api/tmdb/search', { params: { q, page } })
  }
}
