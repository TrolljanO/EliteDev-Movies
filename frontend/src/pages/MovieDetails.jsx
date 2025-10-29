import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TMDb } from '../services/tmdb'
import { Favorites } from '../services/favorites'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'

export default function MovieDetails() {
    const { id } = useParams()

    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        TMDb.details(id)
            .then(({ data }) => {
                if (!active) return
                setMovie(data)
            })
        .catch((err) => {
            if (!active) return
            setError(err)
        })
        .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        let active = true
        if (!user) {
            setIsFavorite(false)
            return
        }
    Favorites.check(id)
        .then(({ data }) => {
            if (!active) return

            const isFav = data?.isFavorite ?? Boolean(data?.favorite ?? data?.id)
            setIsFavorite(isFav)
        })
        .catch(() => setIsFavorite(false))
        return () => {
            active = false
        }
    }, [id, user])

    const toggleFavorite = async () => {
        if (!user) {
            alert('Faça login para adicionar aos favoritos.')
            return
        }
        const payload = { movieId: String(id), title: movie.title, posterPath: movie.poster_path }
        if (isFavorite) {
            setIsFavorite(false)
            try {
                await Favorites.remove(String(id))
            } catch {
                setIsFavorite(true)
            }
        } else {
            setIsFavorite(true)
            try {
                await Favorites.add(payload)
            } catch {
                setIsFavorite(false)
            }
        }
    }

    if (loading) return <Spinner label="Carregando detalhes..."/>
    if (error) return <ErrorState error="Erro ao carregar os detalhes." />
    if (!movie) return null

    const img = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex gap-6">
                {img && <img src={img} alt={movie.title} className="w-48 rounded" />}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">{movie.title}</h1>
                    <p className="text-sm text-gray-300">{movie.overview}</p>
                    <div className="text-sm text-gray-400">
                        {movie.genres?.map((g) => g.name).join(' • ')}
                    </div>
                    <button
                        onClick={toggleFavorite}
                        className={`mt-3 rounded px-3 py-2 text-sm border ${isFavorite ? 'bg-yellow-300 text-black' : 'bg-gray-800 text-white'}`}
                    >
                        {isFavorite ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
                    </button>
                </div>
            </div>
        </div>
    )
}