import { shallowRef } from "vue"

export const accessToken = shallowRef<string | null>(null)

// Devolve o token de acesso em memória, se existir.
export function getAccessToken(): string | null {
    return accessToken.value
}

// Define ou limpa o token de acesso em memória.
export function setAccessToken(token: string | null) {
    accessToken.value = token
}
