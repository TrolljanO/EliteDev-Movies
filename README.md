# 🎬 EliteDev Movies (ambiente de desenvolvimento)

Aplicação de biblioteca de filmes com autenticação e favoritos, organizada como monorepo (backend + frontend). Este README descreve o uso em ambiente de desenvolvimento local.

> Observação: este projeto foi desenvolvido como teste técnico para a Verzel e segue um setup de desenvolvimento (localhost) por padrão.

## 🚀 Tech Stack
- Frontend: React 18 + Vite (Tailwind CSS configurado)
- Backend: Node.js + Express
- Autenticação: BetterAuth (email e senha)
- Banco de dados: PostgreSQL
- Acesso a dados: Kysely (para tabelas de auth) e Knex (para favoritos/migrations)
- API externa: TMDb API v3 (via token v4 Bearer, proxy no backend)

## 📁 Estrutura do repositório
- backend: API Express com BetterAuth, rotas de TMDb e favoritos
- frontend: aplicação React + Vite (consome a API com credenciais)
- scripts: scripts leves em Node para smoke/E2E

## ✨ Funcionalidades
- Autenticação com email/senha (BetterAuth) montada em `/api/auth`
  - Endpoints utilizados: `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/auth/session`, `POST /api/auth/signout`
  - Sessão por cookies HttpOnly (CORS com `credentials: true`) entre `http://localhost:5173` e `http://localhost:3001`
- Favoritos (rotas protegidas)
  - `POST /api/favorites`
  - `GET /api/favorites`
  - `GET /api/favorites/check/:movieId`
  - `DELETE /api/favorites/:movieId`
- Proxy TMDb (sem expor o token no frontend)
  - `GET /api/tmdb/popular`
  - `GET /api/tmdb/search?q=<term>&page=<n>`
  - `GET /api/tmdb/movie/:id`
- Banner/health check: `GET /` retorna `{ message, version, status }`

## 🔧 Requisitos
- Node.js 20+ (LTS recomendado)
- npm
- PostgreSQL (local ou acessível na rede)

## 🔐 Variáveis de ambiente (dev)
Crie os arquivos abaixo com os valores do seu ambiente local.

backend/.env
```
PORT=3001
BETTER_AUTH_URL=http://localhost:3001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=movies
DB_USER=postgres
DB_PASSWORD=postgres
TMDB_API_BASE=https://api.themoviedb.org/3
TMDB_BEARER=SEU_TOKEN_V4_DA_TMDB
NODE_ENV=development
```

frontend/.env
```
VITE_API_BASE_URL=http://localhost:3001
```

Notas importantes (dev):
- CORS no backend permite `http://localhost:5173` e `BETTER_AUTH_URL`; `credentials: true` habilitado.
- Cookies do BetterAuth em dev: `useSecureCookies=false` e `crossSubDomainCookies=false`.

## ▶️ Como rodar (dev)
1) Backend
- Abra um terminal:
  - `cd backend`
  - `npm install`
  - (opcional) criar banco e rodar migrations do Knex se necessário para favoritos
    - `npm run migrate:latest`
  - `npm run dev` (inicia em `http://localhost:3001`)

2) Frontend
- Em outro terminal:
  - `cd frontend`
  - `npm install`
  - `npm run dev` (Vite em `http://localhost:5173`)

3) Teste rápido (com o backend rodando)
- Verifique o banner:
  - `node scripts/smoke_root.mjs`
- TMDb (requer `TMDB_BEARER` válido):
  - `node scripts/tmdb_smoke.mjs`
- Fluxo Auth + Favoritos (E2E leve):
  - `node scripts/auth_favorites_e2e.mjs`

## 🧭 Endpoints (resumo)
- GET `/`
  - Exemplo de resposta: `{ "message": "🎬 Movies Library API", "version": "1.0.0", "status": "Running" }`

- Auth (BetterAuth em `/api/auth`)
  - POST `/api/auth/signup` → body `{ email, password }`
  - POST `/api/auth/signin` → body `{ email, password }`
  - GET `/api/auth/session` → retorna sessão/usuário atual (requer cookie)
  - POST `/api/auth/signout` → invalida sessão

- Favoritos (protegidos; requer sessão)
  - POST `/api/favorites` → body mínimo `{ movieId, movieTitle }` ou `{ movieId, title }`
    - Campos adicionais/fallbacks aceitos: `posterPath`/`poster_path`, `overview`, `releaseDate`/`release_date`
  - GET `/api/favorites` → lista do usuário
  - GET `/api/favorites/check/:movieId` → `{ isFavorite: boolean }`
  - DELETE `/api/favorites/:movieId`

- TMDb (proxy)
  - GET `/api/tmdb/popular`
  - GET `/api/tmdb/search?q=matrix&page=1`
  - GET `/api/tmdb/movie/603`

## 🧩 Detalhes de implementação (dev)
- CORS: `origin` permite `http://localhost:5173` e `BETTER_AUTH_URL`; `credentials: true`.
- BetterAuth:
  - `baseURL` padrão `http://localhost:3001`
  - `trustedOrigins`: `http://localhost:3001`, `http://localhost:5173`
  - `advanced.useSecureCookies=false`, `advanced.crossSubDomainCookies=false` (desenvolvimento)
- Acesso a dados:
  - Kysely (tabelas de auth, p.ex. `user`, `session`)
  - Knex (favoritos e migrations, via `backend/src/config/database.js`)
- Frontend HTTP (axios):
  - `baseURL` de `VITE_API_BASE_URL`
  - `withCredentials=true` (necessário para cookies de sessão)

## 🧪 Scripts úteis
- `node scripts/smoke_root.mjs` — valida `GET /`
- `node scripts/tmdb_smoke.mjs` — checa `/api/tmdb/*`
- `node scripts/auth_favorites_e2e.mjs` — signup → signin → session → favorites add/list/remove

Defina `API_BASE_URL` se desejar apontar para outro host (padrão: `http://localhost:3001`).

## 🛠️ Comandos úteis (backend)
- `npm run dev` — inicia servidor com nodemon
- `npm run start` — inicia servidor em Node
- `npm run migrate:latest` — aplica migrations (Knex)
- `npm run migrate:rollback` — desfaz última migration
- `npm run seed:run` — executa seeds (se configuradas)

## ❗ Solução de problemas (dev)
- 401/sem sessão no frontend: garanta `withCredentials=true` e origem `http://localhost:5173` permitida no backend.
- CORS/cookies não setados: verifique `BETTER_AUTH_URL`, origem do Vite e `credentials: true` no CORS.
- TMDb falhando: confirme `TMDB_BEARER` (token v4) e conectividade.
- Erros de banco: confirme `DB_PORT` numérico e credenciais do PostgreSQL.

## 📄 Licença
ISC — conforme package.json.

## 👤 Autor
TrolljanO
