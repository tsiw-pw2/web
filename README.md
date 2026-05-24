# Frontend (Vue 3 + Vite)

Interface web da aplicação **Limpeza de Praias**. Consome a API REST na raiz do servidor (`/users`, `/campaigns`, …) via proxy do Vite em desenvolvimento.

Funcionalidades recentes na UI (filtros de campanhas, mapa de praias, dashboard alargado, inscrições pendentes): [FEATURES-COSTA.md](../FEATURES-COSTA.md).

## Requisitos

- [Node.js](https://nodejs.org/) 20+ (LTS recomendado)
- [pnpm](https://pnpm.io/)
- API a correr em `http://127.0.0.1:3000` (ver [api/README.md](../api/README.md))
- Base de dados MySQL preparada (ver [database/README.md](../database/README.md))

## Configuração

```bash
cd web
pnpm install
cp .env.example .env
```

Ficheiro `.env`:

| Variável        | Desenvolvimento |
|-----------------|-----------------|
| `VITE_API_URL`  | Deixa **vazio** para usar o proxy do Vite (recomendado em dev). |
| `VITE_DEV_API_PORT` | Porta da API local (por defeito `3000`; deve ser igual a `PORT` em `api/.env`). |

Na API, `CLIENT_URL` no `.env` deve apontar para o frontend (ex.: `http://localhost:5173`) para CORS.

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
| `pnpm test`       | Testes unitários (Vitest)    |

Testes e smoke: [`../TESTING.md`](../TESTING.md).

## Autenticação (resumo)

- O **JWT** fica só em memória no browser (nunca em `localStorage` / `sessionStorage`).
- O **refresh token** vai num cookie `httpOnly` definido pela API (`POST /sessions`, `POST /users`).
- No arranque e após **401**, a app chama `PATCH /sessions/current` (com `credentials: "include"`) para repor o JWT.
- Pedidos autenticados usam `Authorization: Bearer <token>`.

Para testar login local, regista um utilizador com `POST /users` ou pela página de registo.

## Ordem de arranque no monorepo

Guia completo: [README na raiz do monorepo](../README.md).

1. [database/README.md](../database/README.md) — criar BD MySQL vazia
2. [api/README.md](../api/README.md) — `pnpm run dev`
3. **Frontend** — `pnpm run dev` nesta pasta

## Estrutura (resumo)

- `src/app/` — router, arranque da app
- `src/modules/` — funcionalidades (campanhas, praias, auth, …)
- `src/shared/` — componentes UI e layout
- `src/infrastructure/` — cliente HTTP

Documentação extra na raiz: [README.md](../README.md), [MVP-PRODUCAO.md](../MVP-PRODUCAO.md).
