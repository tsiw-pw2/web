import { ref } from "vue"
import { getAccessToken } from "@/infrastructure/access-token"
import { describeApiLoadFailure, isApiServiceUnavailableError } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"
import {
    clearProfileSession,
    hydrateProfileSession,
    persistProfileSession,
} from "@/infrastructure/profileSessionStorage"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const profile = ref<SettingsProfile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

let loadPromise: Promise<SettingsProfile | null> | null = null
let lastProfileLoadWasUnavailable = false

// Indica se o último carregamento falhou por indisponibilidade da API (rede/serviço).
export function wasLastProfileLoadUnavailable(): boolean {
    return lastProfileLoadWasUnavailable
}

// Sincroniza a cache de avatar e nome com o perfil carregado.
function syncAvatarCache(p: SettingsProfile, avatarCacheBust?: number) {
    setProfileSummaryCache({
        avatarUrl: p.avatarUrl ?? null,
        name: p.name,
        avatarCacheBust,
    })
}

// Restaurar perfil da sessão do browser quando a API não responde.
function restoreProfileFromSession(): SettingsProfile | null {
    const snapshot = hydrateProfileSession()
    if (!snapshot) return null
    profile.value = snapshot
    syncAvatarCache(snapshot)
    return snapshot
}

// Hidratar perfil em memória a partir da sessão (após F5 com token válido).
export function hydrateCurrentProfileFromSession(): void {
    if (!getAccessToken() || profile.value) return
    restoreProfileFromSession()
}

// Indica se falhou o carregamento remoto mas há perfil em cache de sessão.
function shouldTreatLoadFailureAsUnavailable(error: unknown): boolean {
    if (isApiServiceUnavailableError(error)) return true
    if (!getAccessToken()) return false
    if (isApiRequestError(error) && error.httpStatus === 401) return false
    return hydrateProfileSession() != null
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
            persistProfileSession(p)
            lastProfileLoadWasUnavailable = false
            return p
        } catch (e) {
            if (shouldTreatLoadFailureAsUnavailable(e)) {
                lastProfileLoadWasUnavailable = true
                error.value = isApiServiceUnavailableError(e)
                    ? e.friendlyMessage
                    : describeApiLoadFailure(e, "o perfil")
                const restored = restoreProfileFromSession()
                if (restored) return restored
                if (profile.value) return profile.value
                return null
            }
            lastProfileLoadWasUnavailable = false
            profile.value = null
            clearProfileSession()
            if (isApiRequestError(e) && e.httpStatus === 401) {
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
  lastProfileLoadWasUnavailable = false
  clearProfileSession()
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
    persistProfileSession(p)
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
