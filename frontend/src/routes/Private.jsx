import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Private ({ children }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="p-6">Carregando...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}