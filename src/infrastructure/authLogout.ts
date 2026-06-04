import { invalidateCurrentProfile } from "@/composables/useCurrentProfile"
import { getApiBaseUrl } from "@/infrastructure/config"
import { clearApiRootCache } from "./apiDiscovery"
import { setAccessToken } from "./access-token"
import { setProfileSummaryCache } from "./profileAvatarCache"

// Termina a sessão no servidor e limpa token e cache local.
export async function logoutSession(): Promise<void> {
    const base = getApiBaseUrl()
    try {
        await fetch(`${base}/sessions/current`, {
            method: "DELETE",
            credentials: "include",
            headers: { Accept: "application/json" },
        })
    } catch {}
    setAccessToken(null)
    clearApiRootCache()
    setProfileSummaryCache(null)
    invalidateCurrentProfile()
}
