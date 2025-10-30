# EliteDev-Movies

Aplicação full‑stack para explorar filmes da TMDb, com autenticação, favoritos e proxy de API. Monorepo com backend (Express + BetterAuth + PostgreSQL via Kysely) e frontend (React + Vite + Tailwind).

- Demo local: http://localhost:5173 (frontend) e http://localhost:3001 (backend)
- Deploy: backend pronto para Render; frontend pronto para Vercel. Guia completo em `scratch/DEPLOY_STEP_BY_STEP.md`.

## Sumário
- Visão geral
- Recursos
- Estrutura do repositório
- Requisitos
- Configuração (ambiente e .env)
- Instalação e execução (dev)
- Endpoints de API
- Autenticação (BetterAuth)
- Testes rápidos (scripts)
- Deploy (Render + Vercel)
- Solução de problemas

## Visão geral
O backend expõe rotas públicas para filmes via proxy TMDb e rotas autenticadas para gerenciamento de favoritos. Sessões são gerenciadas pela BetterAuth com cookies. Em produção, cookies seguros e CORS entre domínios diferentes são suportados.

## Recursos
- Catálogo: populares, busca e detalhes via TMDb (proxy backend)
- Autenticação por e‑mail e senha (BetterAuth)
- Favoritos por usuário autenticado (CRUD básico)
- CORS com credenciais e cookies de sessão
- Scripts de smoke/E2E em Node

## Estrutura do repositório
- backend: API Express (CommonJS), BetterAuth, Kysely (PostgreSQL), rotas `/api/*`
- frontend: React 18 + Vite (ESM), Tailwind CSS
- scripts: checagens rápidas (smoke tests)
- scratch: guias e anotações (não é parte do app)

## Requisitos
- Node.js LTS >= 20
- npm (gerenciador padrão neste repo)
- PostgreSQL acessível (local em dev; gerenciado em produção)
- Token TMDb v4 (bearer)

## Configuração
Crie os arquivos `.env` nas pastas de backend e frontend seguindo os exemplos abaixo.

Backend (backend/.env – desenvolvimento):
```
PORT=3001
BETTER_AUTH_URL=http://localhost:3001
FRONTEND_ORIGIN=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=movies
DB_USER=postgres
DB_PASSWORD=postgres
TMDB_API_BASE=https://api.themoviedb.org/3
TMDB_BEARER=
```

Frontend (frontend/.env – desenvolvimento):
```
VITE_API_BASE_URL=http://localhost:3001
```

Produção (referência):
```
NODE_ENV=production
BETTER_AUTH_URL=https://seu-backend.onrender.com
FRONTEND_ORIGIN=https://seu-frontend.vercel.app
DATABASE_URL=postgres://usuario:senha@host:5432/db
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
TMDB_API_BASE=https://api.themoviedb.org/3
TMDB_BEARER=seu_token_v4
```

Notas:
- O backend aceita `DATABASE_URL` ou o conjunto `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`.
- Em produção, ative SSL conforme provedor (`DB_SSL=true`), e ajuste `DB_SSL_REJECT_UNAUTHORIZED` se necessário.
- CORS usa `BETTER_AUTH_URL` e `FRONTEND_ORIGIN` (suporta múltiplas URLs separadas por vírgula). Cookies seguros são habilitados automaticamente quando `NODE_ENV=production`.

## Instalação e execução (dev)
Backend:
```
cd backend
npm install
npm run dev
```
O servidor inicia em `http://localhost:3001` e loga porta, NODE_ENV e origem do auth.

Frontend:
```
cd frontend
npm install
npm run dev
```
Abra `http://localhost:5173` no navegador. O cliente HTTP usa `VITE_API_BASE_URL` e `withCredentials=true`.

## Endpoints de API (backend)
- GET `/` → banner de status `{ message, version, status }`

TMDb (públicos, via proxy):
- GET `/api/tmdb/popular?page=1`
- GET `/api/tmdb/search?q=matrix&page=1`
- GET `/api/tmdb/movie/:id`

Favoritos (protegidos por sessão):
- GET `/api/favorites` → lista do usuário atual
- POST `/api/favorites` → adiciona favorito
  - body mínimo aceito: `{ "movieId": "603", "movieTitle": "The Matrix", "posterPath": "/..." }`
  - o backend também aceita chaves alternativas: `title`, `poster_path`, `overview`, `releaseDate`/`release_date`
- GET `/api/favorites/check/:movieId`
- DELETE `/api/favorites/:movieId`

## Autenticação (BetterAuth)
A BetterAuth está montada em `/api/auth` e usa cookies de sessão. Em chamadas do frontend, sempre envie com `credentials: 'include'` (axios já está com `withCredentials: true`). Endpoints úteis (padrão da lib – utilizados nos scripts):
- POST `/api/auth/sign-up/email` → cria conta
- POST `/api/auth/sign-in/email` → login
- GET `/api/auth/get-session` → retorna sessão atual
- POST `/api/auth/sign-out` → encerra sessão

Trusted origins e cookie policy são ajustados por ambiente. Em produção, os cookies usam `Secure` e política compatível entre domínios diferentes.

## Testes rápidos (scripts)
Com o backend rodando localmente (`http://localhost:3001`):
```
node scripts/smoke_root.mjs
node scripts/tmdb_smoke.mjs
node scripts/auth_favorites_e2e.mjs
```
Para apontar para produção:
```
API_BASE_URL=https://seu-backend.onrender.com node scripts/smoke_root.mjs
API_BASE_URL=https://seu-backend.onrender.com node scripts/tmdb_smoke.mjs
API_BASE_URL=https://seu-backend.onrender.com node scripts/auth_favorites_e2e.mjs
```

## Deploy (produção)
- Backend: Render (Web Service) com `npm start` em `backend/`, preencher variáveis de ambiente (incluindo DB e TMDb). Health check: `GET /`.
- Frontend: Vercel em `frontend/` com `VITE_API_BASE_URL` apontando para o backend.

Guia detalhado passo a passo: `scratch/DEPLOY_STEP_BY_STEP.md`.

## Solução de problemas
- CORS: valide `FRONTEND_ORIGIN` e `BETTER_AUTH_URL` e redeploy do backend.
- Cookies ausentes: verifique `NODE_ENV=production` no backend e HTTPS no domínio.
- Erros de DB: ajuste SSL (`DB_SSL=true`) e permissões de rede do provedor.
- 401 nos favoritos: confirme sessão em `/api/auth/get-session` e reexecute login.

## Licença
ISC. Consulte `package.json`.
