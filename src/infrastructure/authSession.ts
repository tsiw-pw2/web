import { apiPatch } from "./apiClient"
import { clearApiRootCache, loadApiRoot } from "./apiDiscovery"
import { setAccessToken } from "./access-token"

type RefreshBody = {
    token?: string
}

let restoreInFlight: Promise<boolean> | null = null

// Tenta renovar a sessão com o cookie existente e devolve sucesso ou falha.
export async function tryRestoreSession(): Promise<boolean> {
    if (restoreInFlight) {
        return restoreInFlight
    }
    restoreInFlight = (async () => {
        try {
            const body = await apiPatch<RefreshBody>("/sessions/current")
            if (typeof body?.token !== "string" || body.token.length === 0) {
                return false
            }
            setAccessToken(body.token)
            clearApiRootCache()
            await loadApiRoot(true)
            return true
        } catch {
            return false
        } finally {
            restoreInFlight = null
        }
    })()
    return restoreInFlight
}
