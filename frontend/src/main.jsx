import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FavoritesPage from './pages/Favorites'
import MovieDetails from './pages/MovieDetails'
import Private from './routes/Private'
import NotFound from './pages/NotFound'
import './index.css'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={
                    <Private>
                        <FavoritesPage />
                    </Private>
                }
                />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
)
