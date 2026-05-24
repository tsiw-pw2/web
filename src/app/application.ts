import { createApp } from "vue"
import App from "@/App.vue"
import { registerPlugins } from "@/app/providers/registerPlugins"
import { registerDocumentTitle } from "@/app/middleware/registerDocumentTitle"
import { registerRouterMiddleware } from "@/app/middleware/registerRouterMiddleware"
import { router } from "@/app/router"
import { tryRestoreSession } from "@/infrastructure/authSession"

export async function createApplication() {
    await tryRestoreSession()
    const app = createApp(App)
    registerPlugins(app)
    registerRouterMiddleware(router)
    registerDocumentTitle(router)
    app.use(router)
    return app
}
