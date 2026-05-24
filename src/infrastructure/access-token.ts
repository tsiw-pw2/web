import { shallowRef } from "vue"

export const accessToken = shallowRef<string | null>(null)

export function getAccessToken(): string | null {
    return accessToken.value
}

export function setAccessToken(token: string | null) {
    accessToken.value = token
}
