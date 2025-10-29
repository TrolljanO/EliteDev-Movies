import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthService } from '../services/auth'

export default function Navbar() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await AuthService.signOut()
            setUser(null)
            navigate('/login')
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    return (
        <nav className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
            <Link to="/" className="font-semibold">EliteDev Movies</Link>

            <div className="flex items-center gap-4">
                <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : ''}>
                    Home
                </NavLink>
                <NavLink to="/favorites" className={({ isActive }) => isActive ? 'underline' : ''}>
                    Favoritos
                </NavLink>

                {user ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm opacity-80">{user.email}</span>
                        <button onClick={handleSignout} className="text-sm text-red-300 hover:text-red-200">
                            Sair
                        </button>
                    </div>
                ) : (
                    <NavLink to="/login" className="text-sm">Entrar</NavLink>
                )}
            </div>
        </nav>
    )
}