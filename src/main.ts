import "./assets/css/style.css"
import "vue-sonner/style.css"
import { createApplication } from "@/app/application"

// Mostra mensagem de erro no DOM quando o arranque da aplicação falha.
function showBootstrapError(message: string) {
    const root = document.getElementById("app")
    if (!root) return
    root.innerHTML = `
      <div style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 2rem auto; padding: 1.5rem; color: #171717;">
        <h1 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 0.75rem;">Não foi possível iniciar a aplicação</h1>
        <p style="margin: 0 0 1rem; line-height: 1.5; color: #525252;">${message}</p>
        <p style="margin: 0; font-size: 0.875rem; color: #737373;">Confirma que a API está a correr e que <code>VITE_DEV_API_PORT</code> no ficheiro <code>web/.env</code> coincide com <code>PORT</code> em <code>api/.env</code>. Reinicia o <code>pnpm dev</code> da web depois de alterar o porto.</p>
      </div>
    `
}

createApplication()
    .then((app) => app.mount("#app"))
    .catch((err: unknown) => {
        console.error("[bootstrap]", err)
        const detail = err instanceof Error ? err.message : "Erro desconhecido"
        showBootstrapError(detail)
    })
