import type { Router } from "vue-router"
import type { AccessCapability } from "@/modules/auth/lib/accessPolicy"
import { loadCurrentProfile } from "@/composables/useCurrentProfile"
import { getAccessToken } from "@/infrastructure/access-token"
import { registerSessionExpiredHandler } from "@/infrastructure/sessionExpired"
import { profileHasCapability } from "@/modules/auth/lib/accessPolicy"
import { resolveDefaultAuthedRoute } from "@/modules/auth/lib/postAuthRedirect"
import { safeInternalRedirectPath } from "@/shared/lib/safeRedirect"

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
    const profile = await loadCurrentProfile()
    if (profileHasCapability(profile, capability)) {
        return true
    }
    return capabilityFallbackRoute(capability)
}

export function registerRouterMiddleware(router: Router) {
    registerSessionExpiredHandler(() => {
        const current = router.currentRoute.value
        if (current.meta.requiresAuth !== true) return
        const redirect = safeInternalRedirectPath(current.fullPath)
        void router.replace({
            name: LOGIN_ROUTE_NAME,
            query: redirect ? { redirect } : undefined,
        })
    })

    router.beforeEach(async (to) => {
        const routeName = typeof to.name === "string" ? to.name : ""
        const authenticated = resolveAuthenticated()

        if (authenticated && (routeName === LOGIN_ROUTE_NAME || routeName === REGISTER_ROUTE_NAME)) {
            return await resolveDefaultAuthedRoute(to.query.redirect)
        }

        if (to.meta.requiresAuth !== true) return true
        if (!authenticated) {
            return {
                name: LOGIN_ROUTE_NAME,
                query: { redirect: to.fullPath },
            }
        }

        const capability = to.meta.requiresCapability
        if (capability) {
            const result = await redirectIfCapabilityDenied(capability)
            if (result !== true) return result
        }

        return true
    })
}
