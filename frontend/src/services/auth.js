import { api } from './http'

export const AuthService = {
  signup(payload) {
    return api.post('/api/auth/sign-up/email', payload)
  },
  signin(payload) {
    return api.post('/api/auth/sign-in/email', payload)
  },
  signout() {
    return api.post('/api/auth/sign-out')
  },
  session() {
    return api.get('/api/auth/get-session')
  },
}
