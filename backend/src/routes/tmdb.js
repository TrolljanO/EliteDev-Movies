import express from 'express';

const router = express.Router();

const TMDB_API_BASE = process.env.TMDB_API_BASE || 'https://api.themoviedb.org/3';
const TMDB_BEARER = process.env.TMDB_BEARER

if (!TMDB_BEARER) {
    console.warn('[TMDb] TMDB_BEARER ausente.')
}

async function tmdbFetch(pathWithQuery) {
    const url = `${TMDB_API_BASE}${pathWithQuery}`;
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${TMDB_BEARER}`,
            'Accept': 'application/json',
        },
    })
    if (!res.ok) {
        const text = await res.text()
        const err = new Error(`TMDb ${res.status}: ${text}`)
        err.status = res.status
        throw err
    }
    return res.json()
}

router.get('/popular', async (req, res) => {
    try {
      const page = Number(req.query.page || 1)
      const data = await tmdbFetch(`/movie/popular?page=${page}`)
        res.set('Cache-Control', 'public, max-age=120')
        res.json(data)
    } catch (error) {
        res.status(error.status || 500).json({
            error: 'TMDB_POPULAR_FAILED',
            message: error.message,
        })
    }
})

router.get('/movie/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await tmdbFetch(`/movie/${id}`)
        res.set('Cache-Control', 'public, max-age=300')
        res.json(data)
    } catch (error) {
        res.status(error.status || 500).json({
            error: 'TMDB_DETAILS_FAILED',
            message: error.message,
        })
    }
})

router.get('/search', async (req, res) => {
    try {
        const q = req.query.q || ''
        const page = Number(req.query.page || 1)
        const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&page=${page}`)
        res.set('Cache-Control', 'public, max-age=120')
        res.json(data)
    } catch (error) {
        res.status(error.status || 500).json({
            error: 'TMDB_SEARCH_FAILED',
            message: error.message,
        })
    }
})

export default router;