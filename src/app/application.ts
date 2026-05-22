import { createApp } from "vue"
import App from "@/App.vue"
import { registerPlugins } from "@/app/providers/registerPlugins"
import { registerRouterMiddleware } from "@/app/middleware/registerRouterMiddleware"
import { router } from "@/app/router"

export function createApplication() {
    const app = createApp(App)
    registerPlugins(app)
    registerRouterMiddleware(router)
    app.use(router)
    return app
}
