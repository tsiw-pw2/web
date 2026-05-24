import type { RouteLocationRaw } from "vue-router"
import { loadCurrentProfile } from "@/composables/useCurrentProfile"
import {
    canAccessDashboard,
    defaultAuthedRouteName,
    isPathAllowedForProfile,
} from "@/modules/auth/lib/accessPolicy"
import { safeInternalRedirectPath } from "@/shared/lib/safeRedirect"

export async function resolvePostAuthRedirect(redirectQuery: unknown): Promise<RouteLocationRaw> {
    const profile = await loadCurrentProfile({ force: true })
    const redirect = safeInternalRedirectPath(redirectQuery)
    if (redirect && isPathAllowedForProfile(redirect, profile)) {
        return redirect
    }
    return { name: defaultAuthedRouteName(profile) }
}

export async function resolveDefaultAuthedRoute(): Promise<RouteLocationRaw> {
    const profile = await loadCurrentProfile()
    return { name: defaultAuthedRouteName(profile) }
}

export { canAccessDashboard, defaultAuthedRouteName, isPathAllowedForProfile }
