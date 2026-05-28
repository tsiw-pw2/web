import { computed, onMounted } from "vue"
import { routePaths } from "@/app/router"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { useIsAuthenticated } from "@/composables/useIsAuthenticated"
import { canAccessDashboard } from "@/modules/auth/lib/accessPolicy"

export function usePublicSiteNav() {
    const isAuthenticated = useIsAuthenticated()
    const { profile, loadProfile } = useCurrentProfile()

    onMounted(() => {
        if (isAuthenticated.value) {
            void loadProfile()
        }
    })

    const primaryCtaPath = computed(() => {
        if (!isAuthenticated.value) return routePaths.login
        return canAccessDashboard(profile.value) ? routePaths.dashboard : routePaths.campaigns
    })

    const primaryCtaLabel = computed(() => {
        if (!isAuthenticated.value) return "Entrar"
        return canAccessDashboard(profile.value) ? "Dashboard" : "Campanhas"
    })

    return {
        isAuthenticated,
        primaryCtaPath,
        primaryCtaLabel,
    }
}
