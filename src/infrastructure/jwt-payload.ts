export type AccessTokenPayload = {
    sub?: string
    role?: string
    orgId?: string
    tokenVersion?: number
}

export function decodeAccessTokenPayload(token: string): AccessTokenPayload | null {
    const parts = token.split(".")
    if (parts.length < 2) return null
    try {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
        const json = atob(padded)
        return JSON.parse(json) as AccessTokenPayload
    } catch {
        return null
    }
}
