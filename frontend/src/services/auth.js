import { api } from './http'

export const AuthService = {
  signup(payload) {
    return api.post('/auth/sign-up/email', payload)
  },
  signin(payload) {
    return api.post('/auth/sign-in/email', payload)
  },
  signout() {
    return api.post('/auth/sign-out')
  },
  session() {
    return api.get('/auth/get-session')
  },
}
