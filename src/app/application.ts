import { createApp } from "vue"
import App from "@/App.vue"
import { registerPlugins } from "@/app/providers/registerPlugins"
import { registerDocumentTitle } from "@/app/middleware/registerDocumentTitle"
import { registerRouterMiddleware } from "@/app/middleware/registerRouterMiddleware"
import { router } from "@/app/router"
import { hydrateAccessTokenFromSession } from "@/infrastructure/access-token"
import { hydrateApiRootFromSession } from "@/infrastructure/apiDiscovery"
import { tryRestoreSession } from "@/infrastructure/authSession"
import { hydrateCurrentProfileFromSession } from "@/composables/useCurrentProfile"

// Inicializa a aplicação Vue: sessão, plugins e router.
export async function createApplication() {
    hydrateAccessTokenFromSession()
    hydrateApiRootFromSession()
    hydrateCurrentProfileFromSession()
    // Não bloquear o mount à espera da API (ex.: Render free tier a acordar).
    void tryRestoreSession()
    const app = createApp(App)
    registerPlugins(app)
    registerRouterMiddleware(router)
    registerDocumentTitle(router)
    app.use(router)
    return app
}
