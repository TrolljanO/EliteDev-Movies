// scripts/smoke_root.mjs
// Objetivo: confirmar que o backend está de pé e responde ao banner /
const base = process.env.API_BASE_URL || 'http://localhost:3001'
const res = await fetch(base + '/')
if (!res.ok) {
  throw new Error('Falha ao acessar /: ' + res.status)
}
const json = await res.json()
if (!json.status) {
  throw new Error('Campo status ausente no banner /')
}
console.log('OK /', json)
