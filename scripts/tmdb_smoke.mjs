
// scripts/tmdb_smoke.mjs
const base = process.env.API_BASE_URL || 'http://localhost:3001'

async function run() {
  let res = await fetch(base + '/api/tmdb/popular')
  console.log('popular status:', res.status)
  let j = await res.json()
  console.log('popular count:', j.results?.length)

  res = await fetch(base + '/api/tmdb/search?q=matrix&page=1')
  console.log('search status:', res.status)
  j = await res.json()
  console.log('search count:', j.results?.length)

  res = await fetch(base + '/api/tmdb/movie/603')
  console.log('details status:', res.status)
  j = await res.json()
  console.log('details title:', j.title)
}

run().catch((e) => {
  console.error('tmdb_smoke error:', e)
  process.exit(1)
})
