import { getApiBaseUrl } from "@/infrastructure/config"
import { setAccessToken } from "@/infrastructure/access-token"

type RefreshBody = {
    token?: string
}

let restoreInFlight: Promise<boolean> | null = null

export async function tryRestoreSession(): Promise<boolean> {
    if (restoreInFlight) {
        return restoreInFlight
    }
    restoreInFlight = (async () => {
        const url = `${getApiBaseUrl()}/sessions/current`
        try {
            const res = await fetch(url, {
                method: "PATCH",
                credentials: "include",
                headers: { Accept: "application/json" },
            })
            if (!res.ok) {
                return false
            }
            const body = (await res.json()) as RefreshBody
            if (typeof body.token !== "string" || body.token.length === 0) {
                return false
            }
            setAccessToken(body.token)
            return true
        } catch {
            return false
        } finally {
            restoreInFlight = null
        }
    })()
    return restoreInFlight
}
