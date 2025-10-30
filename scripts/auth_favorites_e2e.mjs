// scripts/auth_favorites_e2e.mjs
// E2E leve: signup → signin → session → favorites add/list/remove
// Requer backend rodando em http://localhost:3001 (ou defina API_BASE_URL)
const base = process.env.API_BASE_URL || 'http://localhost:3001'

function mergeSetCookie(headers) {
  // Node 20 fetch: Headers não tem getSetCookie padronizado; usar raw se disponível
  const raw = headers.raw?.()['set-cookie']
  const arr = Array.isArray(raw) ? raw : (raw ? [raw] : [])
  const simple = arr.map((c) => String(c).split(';')[0])
  return simple.join('; ')
}

let cookie = ''

const email = `user_${Date.now()}@test.local`
const password = 'Pass123!'

// Signup (ignorar erro se já existir)
let res = await fetch(base + '/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
console.log('signup status:', res.status)

// Signin
res = await fetch(base + '/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
console.log('signin status:', res.status)

cookie = mergeSetCookie(res.headers)
console.log('cookie capturado:', cookie)

// Session
res = await fetch(base + '/api/auth/session', { headers: { Cookie: cookie } })
console.log('session status:', res.status)
const session = await res.json()
console.log('session body:', session)
if (!session?.user?.id) {
  throw new Error('Sessão inválida (sem user.id)')
}

// Favorites add → list → remove
const favPayload = { movieId: '603', title: 'The Matrix', posterPath: '/p96dm7sCMn4VYAStA6siNz30G1r.jpg' }

res = await fetch(base + '/api/favorites', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie },
  body: JSON.stringify(favPayload)
})
console.log('favorites add status:', res.status)
const addJson = await res.json().catch(()=>({}))
console.log('favorites add body:', addJson)

res = await fetch(base + '/api/favorites', { headers: { Cookie: cookie } })
const listJson = await res.json()
console.log('favorites list count:', Array.isArray(listJson?.data) ? listJson.data.length : Array.isArray(listJson) ? listJson.length : 'n/a')

res = await fetch(base + '/api/favorites/603', { method: 'DELETE', headers: { Cookie: cookie } })
console.log('favorites delete status:', res.status)
