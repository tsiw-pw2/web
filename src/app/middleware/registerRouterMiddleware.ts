import type { Router } from "vue-router"
import type { AccessCapability } from "@/modules/auth/lib/accessPolicy"
import { loadCurrentProfile } from "@/composables/useCurrentProfile"
import { loadApiRoot } from "@/infrastructure/apiDiscovery"
import { getAccessToken } from "@/infrastructure/access-token"
import { registerSessionExpiredHandler } from "@/infrastructure/sessionExpired"
import { profileHasCapability } from "@/modules/auth/lib/accessPolicy"
import { resolveDefaultAuthedRoute } from "@/modules/auth/lib/postAuthRedirect"

const LOGIN_ROUTE_NAME = "login"
const REGISTER_ROUTE_NAME = "register"

function resolveAuthenticated(): boolean {
    return Boolean(getAccessToken())
}

function capabilityFallbackRoute(capability: AccessCapability): { name: string; replace: true } {
    if (capability === "settingsAdmin") {
        return { name: "settings-profile", replace: true }
    }
    return { name: "campaigns", replace: true }
}

async function redirectIfCapabilityDenied(
    capability: AccessCapability,
): Promise<{ name: string; replace: true } | true> {
    const profile = await loadCurrentProfile({ force: true })
    if (profileHasCapability(profile, capability)) {
        return true
    }
    return capabilityFallbackRoute(capability)
}

function isRouteDebugEnabled(): boolean {
    if (import.meta.env.VITE_DEBUG_ROUTES === "0") return false
    if (import.meta.env.VITE_DEBUG_ROUTES === "1") return true
    return import.meta.env.DEV
}

export function registerRouterMiddleware(router: Router) {
    if (isRouteDebugEnabled()) {
        router.beforeEach((to, from) => {
            const fromPath = from.fullPath || "/"
            const toPath = to.fullPath
            const name = typeof to.name === "string" ? to.name : String(to.name ?? "")
            console.log("-----")
            console.log(`[route] ${fromPath} -> ${toPath}${name ? ` (${name})` : ""}`)
            return true
        })
    }

    registerSessionExpiredHandler(() => {
        const current = router.currentRoute.value
        if (current.meta.requiresAuth !== true) return
        void router.replace({ name: LOGIN_ROUTE_NAME })
    })

    router.beforeEach(async (to) => {
        const routeName = typeof to.name === "string" ? to.name : ""
        const authenticated = resolveAuthenticated()

        if (authenticated && (routeName === LOGIN_ROUTE_NAME || routeName === REGISTER_ROUTE_NAME)) {
            return await resolveDefaultAuthedRoute(to.query.redirect)
        }

        if (authenticated && routeName === "not-found") {
            return await resolveDefaultAuthedRoute()
        }

        if (to.meta.requiresAuth !== true) return true
        if (!authenticated) {
            return { name: LOGIN_ROUTE_NAME }
        }

        try {
            await loadApiRoot()
        } catch {
            return { name: LOGIN_ROUTE_NAME }
        }

        const capability = to.meta.requiresCapability
        if (capability) {
            const result = await redirectIfCapabilityDenied(capability)
            if (result !== true) return result
        }

        return true
    })
}
