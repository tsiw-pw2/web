# Frontend (Vue 3 + Vite)

Interface web da aplicação **Limpeza de Praias**. Consome a API REST em `/api/v1` (proxy em desenvolvimento).

## Requisitos

- [Node.js](https://nodejs.org/) 20+ (LTS recomendado)
- [pnpm](https://pnpm.io/)
- API a correr em `http://127.0.0.1:3000` (ver [api/README.md](../api/README.md))
- Base de dados MySQL preparada (ver [stuff/database/README.md](../stuff/database/README.md))

## Configuração

```bash
cd web
pnpm install
cp .env.example .env
```

Ficheiro `.env`:

| Variável        | Desenvolvimento |
|-----------------|-----------------|
| `VITE_API_URL`  | Deixa **vazio** para usar o proxy do Vite: pedidos a `/api` e `/uploads` vão para `http://127.0.0.1:3000`. |
|                 | Só preenches URL absoluta se a API estiver noutro host (ex.: `http://localhost:3000/api/v1`). |

Na API, `CLIENT_URL` no `.env` deve apontar para o frontend (ex.: `http://localhost:5173`) para CORS e cookies de refresh.

## Arranque em desenvolvimento

```bash
pnpm run dev
```

Abre o URL que o Vite mostrar (normalmente `http://localhost:5173`).

## Outros comandos

| Comando           | Descrição |
|-------------------|-----------|
| `pnpm run build`  | Type-check + build de produção |
| `pnpm run preview`| Pré-visualizar o build |
| `pnpm run format` | Formatar código com Prettier |

## Autenticação (resumo)

- O **access token** fica só em memória no browser (nunca em `localStorage` / `sessionStorage`).
- O **refresh token** vem em cookie HttpOnly da API (`credentials: "include"` no cliente HTTP).
- Em 401, o cliente tenta renovar a sessão uma vez e repete o pedido.

Para testar login local, usa contas do seed da API (`admin@demo.local` e palavra-passe definida em `SEED_USER_PASSWORD`).

## Ordem de arranque no monorepo

1. [Base de dados](../stuff/database/README.md) — criar BD e correr `limpeza_praias.sql`
2. [API](../api/README.md) — `pnpm run dev` na pasta `api/`
3. **Frontend** — `pnpm run dev` nesta pasta

## Estrutura (resumo)

- `src/app/` — router, arranque da app
- `src/modules/` — funcionalidades (campanhas, praias, auth, …)
- `src/shared/` — componentes UI e layout
- `src/infrastructure/` — cliente HTTP

Documentação extra: `stuff/docs/web.md`.
