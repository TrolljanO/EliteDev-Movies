import { api } from './http'

export const TMDb = {
  popular(page = 1) {
    return api.get(`/tmdb/popular`, { params: { page } })
  },
  details(id) {
    return api.get(`/tmdb/movie/${id}`)
  },
  search(q, page = 1) {
      return api.get('/tmdb/search', { params: { q, page } })
  }
}
