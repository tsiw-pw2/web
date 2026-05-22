import type { Router } from "vue-router"
import { getAccessToken } from "@/infrastructure/access-token"
import { tryRefreshAccessToken } from "@/infrastructure/request"

const GUEST_ONLY_ROUTE_NAMES = new Set(["home", "login"])

async function resolveAuthenticated(): Promise<boolean> {
    if (getAccessToken()) return true
    return tryRefreshAccessToken()
}

export function registerRouterMiddleware(router: Router) {
    router.beforeEach(async (to) => {
        const routeName = typeof to.name === "string" ? to.name : ""

        if (GUEST_ONLY_ROUTE_NAMES.has(routeName)) {
            if (await resolveAuthenticated()) {
                return { name: "dashboard" }
            }
            return true
        }

        if (to.meta.requiresAuth !== true) return true
        if (await resolveAuthenticated()) return true
        return { name: "login" }
    })
}
