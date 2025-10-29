import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from "../services/auth.js";

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AuthService.session()
            .then(({ data }) => {
                setUser(data?.user ?? null)
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setLoading(false)
            })

        const onUnauthorized = () => setUser(null)
        window.addEventListener('auth:unauthorized', onUnauthorized)

        return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
    }, [])

    const value = { user, setUser, loading }

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
    return useContext(AuthCtx)
}