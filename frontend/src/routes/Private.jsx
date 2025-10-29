import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Private ({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="p-6">Carregando...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}