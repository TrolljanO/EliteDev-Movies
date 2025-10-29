import { useEffect, useMemo, useState } from 'react'
import { TMDb } from '../services/tmdb'
import { Favorites } from '../services/favorites'
import { useAuth } from '../contexts/AuthContext'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import ErrorState from '../components/ErrorState'

export default function Home() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [query, setQuery] = useState('')
    const [favoritesSet, setFavoritesSet] = useState(() => new Set())

    const { user } = useAuth()

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setError(null)

        TMDb.popular(1)
            .then(({ data }) => {
                if (!mounted) return
                setMovies(data?.results ?? [])
            })
        .catch((err) => {
            if (!mounted) return
            setError(err)
        })
            .finally(() => mounted && setLoading(false))

        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        let active = true
        if (!user) {
            setFavoritesSet(new Set())
            return
        }
        Favorites.list()
            .then(({ data }) => {
                if (!active) return
                const set = new Set((data ?? []).map((f) => String(f.movieId)))
                setFavoritesSet(set)
            })
        .catch((err) => {})
        return () => {
            active = false
        }
    }, [user])

const debouncedQuery = useDebounce(query, 500)

    useEffect(() => {
        let active = true

        if (!debouncedQuery) return

        setLoading(true)
        setError(null)

        TMDb.search(debouncedQuery, 1)
            .then(({ data }) => {
                if (!active) return
                setMovies(data?.results ?? [])
            })
        .catch((err) => {
            if (!active) return
            setError(err)
        })
        .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [debouncedQuery])

const toggleFavorite = async (m) => {
        if (!user) {
            alert('Faça login para adicionar aos favoritos')
            return
        }
        const id = String(m.id)
    if (favoritesSet.has(id)) {
        setFavoritesSet((prev) => {
            const s = new Set(prev)
            s.delete(id)
            return s
        })
        try {
            await Favorites.remove(id)
        } catch (err) {
            setFavoritesSet((prev) => new Set(prev).add(id))
        }
    } else {
        setFavoritesSet((prev) => {
            const s = new Set(prev)
            s.add(id)
            return s
        })
        try {
            await Favorites.add({ movieId: id, title: m.title, posterPath: m.poster_path })
        } catch (err) {
            setFavoritesSet((prev) => {
                const s = new Set(prev)
                s.delete(id)
                return s
            })
        }
    }
}

if (loading) return <Spinner label="Carregando filmes..." />
if (error) return <ErrorState message="Erro ao carregar filmes" />

return (
    <div className="p-6 space-y-4">
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes..."
            className="w-full max-w-md rounded border border-gray-300 px-3 py-2"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((m) => (
                <MovieCard
                    key={m.id}
                    movie={m}
                    isFavorite={favoritesSet.has(String(m.id))}
                    onDetails={() => (window.location.href = `/movie/${m.id}`)}
                    onToggleFavorite={() => toggleFavorite(m)}
                />
            ))}
        </div>

        {movies.length === 0 && (
            <div className="text-sm text-gray-500">Nenhum filme encontrado.</div>
        )}
        </div>
    )
}

function useDebounce(value, delayMs) {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs)
        return () => clearTimeout(id)
    }, [value, delayMs])
    return debounced
}