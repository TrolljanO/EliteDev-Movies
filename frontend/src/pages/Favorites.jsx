import { useEffect, useState } from 'react'
import { Favorites } from '../services/favorites'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'
import MovieCard from '../components/MovieCard'

export default function FavoritesPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        Favorites.list()
            .then(({ data }) => {
                if (!active) return
                const raw = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
                const arr = raw.map((f) => ({
                    movieId: String(f.movieId ?? f.movie_id),
                    title: f.title ?? f.movieTitle ?? f.movie_title,
                    posterPath: f.posterPath ?? f.moviePosterPath ?? f.movie_poster_path,
                }))
                setItems(arr)
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

    const removeFav = async (movieId) => {
        setItems((prev) => prev.filter((i) => String(i.movieId) !== String(movieId)))
        try {
            await Favorites.remove(movieId)
        } catch {
            const { data } = await Favorites.list()
            const raw = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
            const arr = raw.map((f) => ({
                movieId: String(f.movieId ?? f.movie_id),
                title: f.title ?? f.movieTitle ?? f.movie_title,
                posterPath: f.posterPath ?? f.moviePosterPath ?? f.movie_poster_path,
            }))
            setItems(arr)
        }
    }

    if (loading) return <Spinner label="Carregando favoritos..." />
    if (error) return <ErrorState message="Erro ao carregar seus favoritos." />

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Seus Favoritos</h1>
            {items.length === 0 ? (
                <div className="text-sm text-gray-500">Você ainda não favoritou nada.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((fav) => (
                        <MovieCard
                            key={fav.movieId}
                            movie={{ id: fav.movieId, title: fav.title, poster_path: fav.posterPath }}
                            isFavorite={true}
                            onDetails={() => (window.location.href = `/movie/${fav.movieId}`)}
                            onToggleFavorite={() => removeFav(fav.movieId)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}