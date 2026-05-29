# Frontend — Limpeza de Praias

Interface web (Vue 3 + Vite). Consome a API REST via proxy em desenvolvimento.

Guia completo para correr API + Web: [README na raiz](../README.md).

---

## Como correr

### 1. Pré-requisitos

- Node.js 20+
- pnpm
- **API a correr** em `http://127.0.0.1:3000` (ver [api/README.md](../api/README.md))

### 2. Instalar e configurar

```bash
cd web
pnpm install
cp .env.example .env
```

| Variável | Desenvolvimento |
| -------- | --------------- |
| `VITE_API_URL` | Deixa **vazio** (usa proxy Vite) |
| `VITE_DEV_API_PORT` | `3000` — igual a `PORT` em `api/.env` |
| `VITE_APP_NAME` | Nome no título do browser (ex.: `Mariva`) |

Na API, `CLIENT_URL` deve ser `http://localhost:5173` (CORS).

### 3. Arrancar

```bash
pnpm run dev
```

Abre **[http://localhost:5173](http://localhost:5173)**.

### 4. Entrar na app

Com seed da API (`pnpm run db:seed` em `api/`):

- Admin: `admin@demo.local` / `Demo2026!`
- Organizador: `organizador1@demo.local` / `Demo2026!`
- Voluntário: `vol01.maria.silva@email.pt` / `Demo2026!`

---

## Ordem de arranque

```
1. MySQL
2. cd api && pnpm run dev      ← terminal 1
3. cd web && pnpm run dev      ← terminal 2
4. http://localhost:5173
```

---

## Outros comandos

| Comando | Descrição |
| ------- | --------- |
| `pnpm run build` | Type-check + build de produção |
| `pnpm run preview` | Pré-visualizar o build |
| `pnpm test` | Testes unitários (Vitest) |

---

## Autenticação (resumo)

- JWT em **memória** no browser (nunca em `localStorage`)
- Refresh token em cookie `httpOnly` (API)
- Após 401, a app renova o token com `PATCH /sessions/current`

---

## Estrutura (resumo)

- `src/app/` — router, arranque
- `src/modules/` — campanhas, praias, auth, settings, …
- `src/shared/` — componentes UI e layout
- `src/infrastructure/` — cliente HTTP
