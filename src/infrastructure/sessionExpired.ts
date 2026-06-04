import { invalidateCurrentProfile } from "@/composables/useCurrentProfile"
import { clearApiRootCache } from "@/infrastructure/apiDiscovery"
import { setAccessToken } from "@/infrastructure/access-token"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"

let onSessionExpired: (() => void) | null = null

// Regista o callback invocado quando a sessão expira.
export function registerSessionExpiredHandler(handler: () => void) {
    onSessionExpired = handler
}

// Limpa credenciais e perfil em cache e notifica expiração de sessão.
export function handleSessionExpired() {
    setAccessToken(null)
    clearApiRootCache()
    setProfileSummaryCache(null)
    invalidateCurrentProfile()
    onSessionExpired?.()
}
