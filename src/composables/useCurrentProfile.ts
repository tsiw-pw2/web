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

// Sincroniza a cache de avatar e nome com o perfil carregado.
function syncAvatarCache(p: SettingsProfile, avatarCacheBust?: number) {
    setProfileSummaryCache({
        avatarUrl: p.avatarUrl ?? null,
        name: p.name,
        avatarCacheBust,
    })
}

// Carrega o perfil do utilizador autenticado (com deduplicação e cache).
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

// Invalida o perfil em memória para forçar novo carregamento.
export function invalidateCurrentProfile() {
  profile.value = null
  error.value = null
  loadPromise = null
}

// Composable partilhado para estado e acções do perfil do utilizador.
export function useCurrentProfile() {
  // Delega no carregamento global do perfil com opção de forçar refresh.
  async function loadProfile(options?: { force?: boolean }): Promise<SettingsProfile | null> {
    return loadCurrentProfile(options)
  }

  // Actualiza o perfil local e a cache de avatar na UI.
  function setProfile(p: SettingsProfile, options?: { avatarCacheBust?: number }) {
    profile.value = p
    error.value = null
    syncAvatarCache(p, options?.avatarCacheBust)
  }

  // Limpa o perfil em memória e pede novo carregamento na próxima leitura.
  function invalidateProfile() {
    invalidateCurrentProfile()
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
