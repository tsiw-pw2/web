# Frontend (`web/`)

Vue 3, TypeScript, Vite, Vue Router, Tailwind. Ver também `../docs/web.md`, o índice em `.cursor/rules/README.md` e as rules em `.cursor/rules/web/`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm run build
pnpm run format
```

Variáveis de ambiente: copiar `.env.example` para `.env` e ajustar `VITE_API_URL`, `VITE_USE_API_DASHBOARD`, etc.

---

## Checklist — o que falta fazer no frontend

Marcar à medida que avanças. Depois disto, faz sentido uma ronda de reorganização e limpeza de código.

### Autenticação e sessão

- [ ] Definir onde vive o access token (só memória) e como o refresh via cookie é disparado
- [ ] Cliente HTTP: enviar `Authorization: Bearer` quando existir sessão
- [ ] Tratar 401: refresh + retry uma vez (e logout / redirect se falhar)
- [ ] Guards de rota para páginas que exijam login (quando o produto o definir)
- [ ] Estado “utilizador atual” (composable ou store) sem expor dados sensíveis na UI de debug

### HTTP, serviços e dados

- [ ] `services/api/` por domínio (`campaigns`, `beaches`, `waste`, `settings`, …) em vez de só ficheiros soltos em `services/`
- [ ] Mapear DTO → UI quando a resposta real da API diferir dos tipos em `types/`
- [ ] Erros de rede: mensagens genéricas ao utilizador; sem stack nem detalhes técnicos
- [ ] Retry opcional para falhas transitórias (só onde fizer sentido)
- [ ] Cancelamento de pedidos (AbortController) ao sair de páginas com fetch em curso
- [ ] Timeout ou política clara para pedidos lentos

### Dashboard e métricas

- [ ] Ligar `VITE_USE_API_DASHBOARD=true` quando o endpoint existir e validar o JSON contra `DashboardOverview`
- [ ] Substituir `more-href="#"` por rotas reais (`routePaths.campaigns`, etc.)
- [ ] Estados empty / loading / erro consistentes com o resto da app
- [ ] (Opcional) Atualização em tempo real ou polling — só se for requisito

### Campanhas

- [ ] `CreateCampaignModal`: formulário real, validação, submissão via serviço
- [ ] Lista / detalhe / edição / remoção conforme requisitos do produto
- [ ] Empty states e mensagens alinhadas a `user-facing-copy`

### Praias, resíduos, definições

- [ ] `BeachesPage`: listagem, criar/editar, empty/error/loading
- [ ] `WastePage`: idem
- [ ] `SettingsPage`: secções reais (perfil, notificações, etc.) conforme produto

### Rotas e shell

- [ ] Página 404 (e opcionalmente 403) com layout da app
- [ ] `meta` por rota: título de documento, `bodyScroll`, futuros guards
- [ ] Links externos com `rel`/`target` quando aplicável
- [ ] Rever alt de imagens e textos de navegação para acessibilidade

### UI, acessibilidade e UX

- [ ] Foco ao abrir/fechar modais (trap ou devolução de foco ao trigger)
- [ ] Teclado: modais (Escape já parcial), listas, botões
- [ ] Contraste e labels em inputs
- [ ] Estados disabled / busy em botões de submissão
- [ ] Skeletons ou spinners — padrão único em toda a app

### Componentes e domínio

- [ ] Renomear `CoastIcon` → `BeachIcon` (opcional, alinhar com `beaches`)
- [ ] Extrair padrões repetidos de cabeçalho de página (título + ação) se começarem a duplicar-se (sem mudar visual)
- [ ] Garantir que `shared/components/ui/` não importa router/services

### Tipos e contratos

- [ ] `types/` completo para cada recurso que a API expuser (pode ser contrato desejado antes da API existir)
- [ ] Evitar `any` em props públicas e em respostas parseadas

### Composables e estado

- [ ] Composables por caso de uso (`useCampaignList`, `useBeachForm`, …) quando a lógica crescer
- [ ] Pinia (ou outro) só se o estado global for mesmo necessário; evitar store “god”

### Qualidade e tooling

- [ ] Correr `pnpm run format` / lint e corrigir drift
- [ ] Testes unitários em composables e funções puras (mapeadores em serviços)
- [ ] Testes de componente ou e2e nos fluxos críticos
- [ ] Resolver aviso `baseUrl` deprecado no `tsconfig` quando for conveniente

### Segurança no browser

- [ ] Confirmar nada de tokens em `localStorage` / `sessionStorage`
- [ ] Rever `v-html` e qualquer HTML vindo do utilizador
- [ ] CSP: evitar novos inline scripts / `eval`

### Performance e build

- [ ] Manter lazy load de rotas pesadas ao adicionar páginas grandes
- [ ] Imagens: tamanhos, `loading="lazy"` onde fizer sentido
- [ ] Analisar bundle (ex. vite-plugin-visualizer) quando o app crescer

### Ambiente e configuração

- [ ] `.env.example` completo (`VITE_API_URL`, flags `VITE_USE_API_*`, …)
- [ ] Validar env ao arranque (falhar cedo se variáveis obrigatórias faltarem em builds que precisem)

### Documentação interna

- [ ] Atualizar `docs/web.md` quando `services/api/` e auth existirem
- [ ] Manter rules `.cursor` alinhadas com decisões novas

### Limpeza / reorganização (fase 2)

- [ ] Refactor dedicado: pastas, nomes, exports em `index.ts`, remover dead code
- [ ] Imports com `@/` onde fizer sentido
- [ ] Manter padrão `modules/<domínio>/` para todas as áreas de negócio

---

## Stack de referência

- [Vue 3 script setup](https://vuejs.org/api/sfc-script-setup.html)
- [TypeScript com Vue](https://vuejs.org/guide/typescript/overview.html)
