# 🎬 EliteDev Movies (backend serverless na Vercel)

Aplicação de biblioteca de filmes com autenticação e favoritos, organizada como monorepo (backend + frontend). Este README documenta o novo backend adaptado para Vercel Serverless Functions e como desenvolver, testar e publicar nesse modelo.

> Importante: o backend deixou de usar um servidor Express com `app.listen()` e agora expõe handlers serverless em `/api`. Isso permitiu o deploy 100% na Vercel (backend + frontend).

## 🚀 Tech Stack
- Frontend: React 18 + Vite (Tailwind CSS configurado)
- Backend: Node.js + Express (sem `app.listen`, exportando handlers serverless)
- Autenticação: BetterAuth (email e senha)
- Banco de dados: PostgreSQL
- Acesso a dados: Kysely (para tabelas de auth) e Knex (para favoritos/migrations)
- API externa: TMDb API v3 (via token v4 Bearer, acessada pelo backend)

## 📁 Estrutura do repositório
- api: rotas serverless da Vercel (cada arquivo é uma rota). O `api/index.js` centraliza e exporta os handlers das rotas (auth, favorites, tmdb e root/health).
- backend: código de domínio/infra (auth, db, serviços) reutilizado pelas rotas serverless
- frontend: aplicação React + Vite que consome as rotas serverless
- scripts: scripts leves em Node para smoke/E2E (podem apontar para `vercel dev` ou produção)

Resumo da mudança no backend:
- O arquivo `backend/src/server.js` foi removido/aposentado (ou mantido apenas para referência local); não usamos mais `app.listen()`.
- As rotas foram movidas para o diretório raiz `/api`, seguindo o padrão Vercel Serverless Functions.
- Novo ponto de entrada: `api/index.js` exporta o roteador/handlers e reexporta sub-rotas.

## ✨ Funcionalidades
- Autenticação com email/senha (BetterAuth) montada em `/api/auth`
  - Endpoints: `POST /api/auth/signup`, `POST /api/auth/signin`, `GET /api/auth/session`, `POST /api/auth/signout`
  - Sessão por cookies HttpOnly (CORS com `credentials: true`) — em produção roda no mesmo domínio Vercel
- Favoritos (rotas protegidas)
  - `POST /api/favorites`
  - `GET /api/favorites`
  - `GET /api/favorites/check/:movieId`
  - `DELETE /api/favorites/:movieId`
- Proxy TMDb (token v4 nunca exposto no frontend)
  - `GET /api/tmdb/popular`
  - `GET /api/tmdb/search?q=<term>&page=<n>`
  - `GET /api/tmdb/movie/:id`
- Health check: `GET /api` ou `GET /api/` retorna `{ message, version, status }`

## 🔧 Requisitos
- Node.js 20+ (LTS recomendado)
- npm
- PostgreSQL (local, remoto, ou managed)
- Conta Vercel (para preview/produção)

## 🔐 Variáveis de ambiente
Defina as variáveis no ambiente local e na Vercel (Project Settings → Environment Variables).

Backend (Vercel + dev):
```
BETTER_AUTH_URL=<URL do backend>  # Em produção, deixe vazio ou igual ao domínio Vercel
DB_HOST=...
DB_PORT=5432
DB_NAME=movies
DB_USER=postgres
DB_PASSWORD=postgres
TMDB_API_BASE=https://api.themoviedb.org/3
TMDB_BEARER=SEU_TOKEN_V4_DA_TMDB
NODE_ENV=production # em dev, `vercel dev` define como development
```

Frontend (Vite):
```
# Em desenvolvimento com `vercel dev`, a URL geralmente é http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000
```

Notas importantes:
- No modelo serverless, não há porta dedicada do backend; as rotas ficam sob o mesmo host do frontend: `/api/*`.
- Em desenvolvimento local com Vercel, o host padrão é `http://localhost:3000`.

## ▶️ Como rodar em desenvolvimento (serverless)
Opção A — usando o Vercel CLI (recomendado)
1. Instale dependências do monorepo normalmente (frontend e backend):
   - `cd frontend && npm install && cd ..`
   - `cd backend && npm install && cd ..`
2. Instale a CLI e faça login: `npm i -g vercel` e `vercel login`
3. Rode localmente: `vercel dev`
   - O site subirá em `http://localhost:3000`
   - As rotas serverless estarão em `http://localhost:3000/api/*`

Opção B — Vite + mocks (somente frontend) 
- `cd frontend && npm run dev` (útil para trabalhar UI isoladamente). Para rotas reais, prefira `vercel dev`.

### Teste rápido (com `vercel dev` rodando)
- Health: `node scripts/smoke_root.mjs`
- TMDb (requer `TMDB_BEARER`): `node scripts/tmdb_smoke.mjs`
- Auth + Favoritos (E2E leve): `node scripts/auth_favorites_e2e.mjs`

Defina `API_BASE_URL` se desejar apontar os scripts para outro host (por padrão usam `http://localhost:3000`).

## 🧭 Endpoints (resumo)
- GET `/api/`
  - Exemplo: `{ "message": "🎬 Movies Library API", "version": "1.0.0", "status": "Running" }`

- Auth (BetterAuth em `/api/auth`)
  - POST `/api/auth/signup` → `{ email, password }`
  - POST `/api/auth/signin` → `{ email, password }`
  - GET `/api/auth/session`
  - POST `/api/auth/signout`

- Favoritos (protegidos)
  - POST `/api/favorites` → `{ movieId, movieTitle | title, posterPath | poster_path, overview, releaseDate | release_date }`
  - GET `/api/favorites`
  - GET `/api/favorites/check/:movieId` → `{ isFavorite: boolean }`
  - DELETE `/api/favorites/:movieId`

- TMDb (proxy)
  - GET `/api/tmdb/popular`
  - GET `/api/tmdb/search?q=matrix&page=1`
  - GET `/api/tmdb/movie/603`

## 🧩 Detalhes de implementação (serverless)
- Não usamos `app.listen()`. Cada arquivo em `/api` exporta um handler (ou o `api/index.js` centraliza o roteamento) compatível com Vercel.
- Cookies/sessão do BetterAuth funcionam em domínio único (frontend + API no mesmo host), simplificando CORS em produção.
- No desenvolvimento com `vercel dev`, a origem é `http://localhost:3000`.
- Acesso a dados:
  - Kysely (auth)
  - Knex (favoritos), configurado em `backend/src/config/database.js`
- Frontend HTTP (axios):
  - `baseURL` de `VITE_API_BASE_URL` (local: `http://localhost:3000`, produção: vazio/relativo)
  - `withCredentials=true` para cookies de sessão quando necessário

## 🧪 Scripts úteis
- `node scripts/smoke_root.mjs` — valida `GET /api/`
- `node scripts/tmdb_smoke.mjs` — checa `/api/tmdb/*`
- `node scripts/auth_favorites_e2e.mjs` — signup → signin → session → favorites add/list/remove

Use `API_BASE_URL` para apontar para preview/produção (ex.: `https://<seu-projeto>.vercel.app`).

## 🚢 Deploy na Vercel
- Primeiro deploy: `vercel` (faça o link do projeto) ou conecte o repositório no painel da Vercel.
- Variáveis de ambiente: configure no projeto (Development/Preview/Production) antes do deploy.
- Builds/rotas:
  - O diretório `/api` é detectado automaticamente como Serverless Functions.
  - O frontend (Vite) é publicado como estático (build via `npm run build` do `frontend`).
- Domínio final: `https://<seu-projeto>.vercel.app`.

### Ordem para a PR
1. Ao abrir o Pull Request, adicione a label `YOLO` para ganhar a badge YOLO no GitHub.
2. Após revisão, faça merge na branch `main`, que é o ambiente produtivo da Vercel.

## 🛠️ Comandos úteis
- `vercel dev` — roda frontend + funções serverless localmente
- `vercel` — cria preview deployment
- `vercel --prod` — deploy para produção
- `cd backend && npm run migrate:latest` — aplica migrations (se necessário)

## ❗ Solução de problemas
- 401/sem sessão no frontend: garanta `withCredentials=true` e que os scripts/axios usam o mesmo host (`/api/*` no mesmo domínio).
- TMDb falhando: confirme `TMDB_BEARER` (token v4) e conectividade.
- Banco de dados: confirme `DB_*` na Vercel e acesso de rede.

## 📄 Licença
ISC — conforme package.json.

## 👤 Autor
TrolljanO
