import { invalidateCurrentProfile } from "@/composables/useCurrentProfile"
import { setAccessToken } from "@/infrastructure/access-token"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"

let onSessionExpired: (() => void) | null = null

export function registerSessionExpiredHandler(handler: () => void) {
    onSessionExpired = handler
}

export function handleSessionExpired() {
    setAccessToken(null)
    setProfileSummaryCache(null)
    invalidateCurrentProfile()
    onSessionExpired?.()
}
