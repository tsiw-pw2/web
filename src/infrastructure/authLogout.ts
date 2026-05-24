import { getApiBaseUrl } from "@/infrastructure/config"
import { setAccessToken } from "./access-token"
import { setProfileSummaryCache } from "./profileAvatarCache"

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
    setProfileSummaryCache(null)
}
