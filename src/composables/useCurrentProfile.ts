import { ref } from "vue"
import { describeApiLoadFailure, isApiServiceUnavailableError } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const profile = ref<SettingsProfile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

let loadPromise: Promise<SettingsProfile | null> | null = null

function syncAvatarCache(p: SettingsProfile, avatarCacheBust?: number) {
    setProfileSummaryCache({
        avatarUrl: p.avatarUrl ?? null,
        name: p.name,
        avatarCacheBust,
    })
}

export async function loadCurrentProfile(options?: { force?: boolean }): Promise<SettingsProfile | null> {
    const force = options?.force === true
    if (!force && profile.value) return profile.value
    if (!force && loadPromise) return loadPromise

    loading.value = true
    error.value = null

    loadPromise = (async () => {
        try {
            const p = await fetchProfile()
            profile.value = p
            syncAvatarCache(p)
            return p
        } catch (e) {
            profile.value = null
            if (isApiServiceUnavailableError(e)) {
                error.value = e.friendlyMessage
            } else if (isApiRequestError(e) && e.httpStatus === 401) {
                error.value = "Não foi possível carregar o perfil. Confirma que tens sessão iniciada."
            } else {
                error.value = describeApiLoadFailure(e, "o perfil")
            }
            return null
        } finally {
            loading.value = false
            loadPromise = null
        }
    })()

    return loadPromise
}

export function useCurrentProfile() {
    async function loadProfile(options?: { force?: boolean }): Promise<SettingsProfile | null> {
        return loadCurrentProfile(options)
    }

    function setProfile(p: SettingsProfile, options?: { avatarCacheBust?: number }) {
        profile.value = p
        error.value = null
        syncAvatarCache(p, options?.avatarCacheBust)
    }

    function invalidateProfile() {
        profile.value = null
        error.value = null
        loadPromise = null
    }

    return {
        profile,
        loading,
        error,
        loadProfile,
        setProfile,
        invalidateProfile,
    }
}
