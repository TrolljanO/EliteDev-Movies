import { api } from './http'

export const AuthService = {
  signup(payload) {
    return api.post('/api/auth/signup', payload)
  },
  signin(payload) {
    return api.post('/api/auth/signin', payload)
  },
  signout() {
    return api.post('/api/auth/signout')
  },
  session() {
    return api.get('/api/auth/session')
  },
}
