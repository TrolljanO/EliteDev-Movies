# Deploy passo a passo (Vercel + Backend + Banco de Dados)

Este guia te conduz, como se um sênior estivesse te orientando, para publicar o frontend na Vercel, colocar o backend online e resolver o banco de dados (saindo do self-host local para um serviço gerenciado). Siga na ordem.

---

## 1) Decidir e provisionar o banco de dados online
Você disse que hoje tudo roda num Supabase self-host local e não tem DB público. Para produção, use um Postgres gerenciado. Opções simples e com free tier:
- Neon (Postgres serverless)
- Supabase Cloud (Postgres + ferramentas)
- Render PostgreSQL (instância gerenciada)

Passo a passo (exemplo com Neon, adapte se escolher outro):
1. Crie uma conta no Neon.
2. Crie um projeto Postgres.
3. Copie as credenciais: host, port, database, user, password e, se houver, a DATABASE_URL.
4. Em provedores que exigem SSL, deixe anotado: normalmente será necessário `ssl=true`.

Se preferir Supabase Cloud:
1. Crie um projeto no Supabase.
2. Em Settings → Database, copie host, port, database, user, password. A `DATABASE_URL` também é fornecida.
3. Supabase exige SSL; guarde essa informação.

Se preferir Render PostgreSQL:
1. Crie uma instância de Postgres.
2. Copie as credenciais e verifique se a conexão requer SSL.

Migração dos dados (saindo do self-host):
- Caso já tenha dados/tabelas locais, exporte um dump (pg_dump) do seu self-host e importe no provedor escolhido (pg_restore). Em Supabase/Neon, há guias claros para import.
- Se só precisa das tabelas do BetterAuth e da feature de favoritos, você pode subir “a partir do zero” que a BetterAuth cria as tabelas dela automaticamente; e para os favoritos, rode suas migrations/seed se necessário.

Checklist do que você precisa no final desta etapa:
- Um Postgres público acessível.
- Credenciais anotadas: HOST, PORT, DB, USER, PASSWORD ou uma DATABASE_URL.
- Decisão sobre SSL (muito provavelmente “sim”).

---

## 2) Configurar variáveis de ambiente do backend (produção)
O backend foi ajustado para:
- Aceitar `DATABASE_URL` ou o conjunto `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`.
- Suportar SSL opcional via variáveis:
  - `DB_SSL=true` (ativa SSL)
  - `DB_SSL_REJECT_UNAUTHORIZED=false` (útil em provedores gerenciados que usam certificados gerenciados)
- CORS/controlado por origens dinâmicas:
  - `BETTER_AUTH_URL`: URL pública do backend
  - `FRONTEND_ORIGIN`: URL pública do frontend (Vercel)
- Cookies seguros em produção (BetterAuth): quando `NODE_ENV=production`, cookies `Secure` e compatíveis com domínios diferentes são habilitados.

Variáveis obrigatórias para produção (backend):
- `PORT` (a plataforma costuma injetar; mantenha suportado)
- `NODE_ENV=production`
- `BETTER_AUTH_URL=https://SEU_BACKEND_PUBLICO`
- `FRONTEND_ORIGIN=https://SEU_FRONTEND_VERCEL`
- Banco de dados (uma das opções abaixo):
  - `DATABASE_URL=...` e opcionalmente `DB_SSL=true` e `DB_SSL_REJECT_UNAUTHORIZED=false`
  - Ou: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e opcionalmente `DB_SSL=true` e `DB_SSL_REJECT_UNAUTHORIZED=false`
- TMDb:
  - `TMDB_API_BASE=https://api.themoviedb.org/3`
  - `TMDB_BEARER=SEU_TOKEN_V4`

---

## 3) Publicar o backend (Render ou outro)
Exemplo com Render (Web Service):
1. Crie um novo Web Service apontando para o diretório `backend/` do repositório.
2. Build command: `npm install`
3. Start command: `npm start`
4. Defina as variáveis de ambiente listadas na seção anterior.
5. Faça o deploy e, ao terminar, pegue a URL pública (ex.: `https://seu-backend.onrender.com`).
6. Teste o health check:
   - `curl -i https://seu-backend.onrender.com/` → deve retornar JSON com `{ message, version, status }`.

Se usar Railway/Fly/Outro, adapte: garanta que o `npm start` rode `src/server.js` e configure as envs equivalentes.

---

## 4) Configurar o frontend para produção (Vercel)
1. No Vercel, crie um novo projeto a partir do diretório `frontend/`.
2. Em Settings → Environment Variables, adicione:
   - `VITE_API_BASE_URL=https://SEU_BACKEND_PUBLICO`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Faça o deploy e obtenha a URL pública do frontend (ex.: `https://seu-frontend.vercel.app`).

Atualize o backend para conhecer o frontend público:
- No provedor do backend, ajuste `FRONTEND_ORIGIN` para a URL da Vercel.
- Garanta que `BETTER_AUTH_URL` continue sendo a URL do backend.
- Redeploy do backend após alterar as envs.

---

## 5) Testar o fluxo em produção
Sequência sugerida:
1. Acesse `https://SEU_BACKEND_PUBLICO/` e confirme o JSON do banner.
2. Teste TMDb pelo backend:
   - `https://SEU_BACKEND_PUBLICO/api/tmdb/popular`
   - `https://SEU_BACKEND_PUBLICO/api/tmdb/search?q=matrix&page=1`
   - `https://SEU_BACKEND_PUBLICO/api/tmdb/movie/603`
3. Abra o frontend Vercel.
4. Registre-se e faça login.
5. Verifique no DevTools → Application → Cookies que os cookies são `Secure` e com política compatível entre domínios.
6. Acesse `/favorites`, adicione/remova favoritos e confirme a persistência.

Smoke tests via scripts (opcional):
- Do seu computador, com o backend público:
  - `API_BASE_URL=https://SEU_BACKEND_PUBLICO node scripts/smoke_root.mjs`
  - `API_BASE_URL=https://SEU_BACKEND_PUBLICO node scripts/tmdb_smoke.mjs`
  - `API_BASE_URL=https://SEU_BACKEND_PUBLICO node scripts/auth_favorites_e2e.mjs`

---

## 6) Resolvendo problemas comuns
- CORS bloqueando requisições: confira `FRONTEND_ORIGIN` e `BETTER_AUTH_URL` no backend e reimplante.
- Cookies não aparecendo: confirme `NODE_ENV=production` no backend, `withCredentials=true` no frontend (já configurado), e que o navegador não está bloqueando por SameSite/secure.
- Erros de DB: para provedores gerenciados, geralmente ative `DB_SSL=true` e `DB_SSL_REJECT_UNAUTHORIZED=false`. Garanta que a rede do provedor permita conexões do seu host.
- 401 nos favoritos: confira se a sessão está ativa; refaça login; valide se o domínio do frontend coincide com o configurado no backend.

---

## 7) O que já está pronto no repositório
- Frontend usa `VITE_API_BASE_URL` e `withCredentials=true` por padrão.
- Backend preparado para:
  - CORS por env (`FRONTEND_ORIGIN` e `BETTER_AUTH_URL`).
  - Cookies seguros quando `NODE_ENV=production`.
  - Banco via `DATABASE_URL` ou variáveis separadas, com SSL opcional.
  - TMDb via `TMDB_API_BASE` e `TMDB_BEARER`.

---

## 8) Modelos de .env (referência)
Backend (produção):
```
NODE_ENV=production
PORT=3001
BETTER_AUTH_URL=https://seu-backend.onrender.com
FRONTEND_ORIGIN=https://seu-frontend.vercel.app
DATABASE_URL=postgres://usuario:senha@host:5432/db
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
TMDB_API_BASE=https://api.themoviedb.org/3
TMDB_BEARER=seu_token_v4
```

Frontend (Vercel → Environment Variables):
```
VITE_API_BASE_URL=https://seu-backend.onrender.com
```

Local (desenvolvimento):
- backend/.env
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
- frontend/.env
```
VITE_API_BASE_URL=http://localhost:3001
```

---

## 9) Dica final: escolha do provedor de DB
- Quer simplicidade e custo zero inicial: Neon.
- Quer um ecossistema completo (Auth adicional, Storage, Realtime): Supabase Cloud.
- Quer tudo no Render: Postgres do Render para reduzir latência com backend no mesmo provedor.

Com o banco provisionado e as envs preenchidas, basta implantar backend e frontend, rodar os smoke tests e validar o fluxo completo.