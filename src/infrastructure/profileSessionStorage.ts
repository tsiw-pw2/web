import type { SettingsProfile } from "@/modules/settings/types/profile"

const SESSION_STORAGE_KEY = "mariva.profile"

// Guarda o perfil na sessão do browser (sobrevive a F5 na mesma aba).
export function persistProfileSession(profile: SettingsProfile): void {
    try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile))
    } catch {
        // sessionStorage indisponível
    }
}

// Restaura o perfil guardado na sessão, se existir e for válido.
export function hydrateProfileSession(): SettingsProfile | null {
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as SettingsProfile
        if (typeof parsed.id !== "string" || typeof parsed.role !== "string") return null
        return parsed
    } catch {
        return null
    }
}

// Remove o perfil guardado na sessão.
export function clearProfileSession(): void {
    try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
        // Ignorar falhas de escrita
    }
}
