import { shallowRef } from "vue"

const SESSION_STORAGE_KEY = "mariva.accessToken"

export const accessToken = shallowRef<string | null>(null)

// Restaura o token da sessão do browser (sobrevive a F5 na mesma aba).
export function hydrateAccessTokenFromSession(): void {
    if (accessToken.value) return
    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (typeof stored === "string" && stored.length > 0) {
            accessToken.value = stored
        }
    } catch {
        // sessionStorage indisponível (ex.: modo privado restrito)
    }
}

// Devolve o token de acesso em memória, se existir.
export function getAccessToken(): string | null {
    return accessToken.value
}

// Define ou limpa o token de acesso em memória e na sessão do browser.
export function setAccessToken(token: string | null) {
    accessToken.value = token
    try {
        if (token) {
            sessionStorage.setItem(SESSION_STORAGE_KEY, token)
        } else {
            sessionStorage.removeItem(SESSION_STORAGE_KEY)
        }
    } catch {
        // Ignorar falhas de escrita em sessionStorage
    }
}
