import { ref } from "vue"

export const profileAvatarUrlCache = ref<string | null>(null)
export const profileDisplayNameCache = ref<string | null>(null)
export const profileAvatarCacheBust = ref(0)

export function setProfileSummaryCache(
    data: { avatarUrl: string | null; name: string; avatarCacheBust?: number } | null,
) {
    if (!data) {
        profileAvatarUrlCache.value = null
        profileDisplayNameCache.value = null
        profileAvatarCacheBust.value = 0
        return
    }
    profileAvatarUrlCache.value = data.avatarUrl
    profileDisplayNameCache.value = data.name
    if (data.avatarCacheBust != null) {
        profileAvatarCacheBust.value = data.avatarCacheBust
    }
}
