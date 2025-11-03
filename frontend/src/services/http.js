import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://elite-dev-movies.vercel.app' || import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)