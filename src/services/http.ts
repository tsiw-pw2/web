import { accessToken } from "../auth/accessToken"

export function getApiBase(): string {
    const b = import.meta.env.VITE_API_URL as string | undefined
    if (!b) throw new Error("VITE_API_URL não definido")
    return b.replace(/\/$/, "")
}

function baseUrl(): string {
    return getApiBase()
}

export class ApiRequestError extends Error {
    status: number
    body: unknown
    constructor(status: number, message: string, body: unknown) {
        super(message)
        this.status = status
        this.body = body
    }
}

let refreshInFlight: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight
    refreshInFlight = (async () => {
        try {
            const res = await fetch(`${baseUrl()}/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: "{}",
            })
            if (!res.ok) {
                accessToken.value = null
                return false
            }
            const data = (await res.json()) as { access_token?: string }
            if (data.access_token) accessToken.value = data.access_token
            return Boolean(data.access_token)
        } catch {
            accessToken.value = null
            return false
        } finally {
            refreshInFlight = null
        }
    })()
    return refreshInFlight
}

type Json = Record<string, unknown>

export async function apiFetch<T>(
    path: string,
    init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
    const url = path.startsWith("http") ? path : `${baseUrl()}${path.startsWith("/") ? "" : "/"}${path}`
    const headers = new Headers(init.headers)
    if (!init.skipAuth && accessToken.value) {
        headers.set("Authorization", `Bearer ${accessToken.value}`)
    }
    const isRefreshCall = path.includes("/auth/refresh")
    let res = await fetch(url, { ...init, headers, credentials: "include" })
    if (res.status === 401 && !init.skipAuth && !isRefreshCall) {
        const ok = await tryRefresh()
        if (ok) {
            const h2 = new Headers(init.headers)
            if (accessToken.value) h2.set("Authorization", `Bearer ${accessToken.value}`)
            res = await fetch(url, { ...init, headers: h2, credentials: "include" })
        }
    }
    if (res.status === 204) return undefined as T
    const text = await res.text()
    let parsed: unknown = null
    if (text) {
        try {
            parsed = JSON.parse(text) as unknown
        } catch {
            parsed = text
        }
    }
    if (!res.ok) {
        const msg =
            typeof parsed === "object" && parsed !== null && "description" in parsed
                ? String((parsed as Json).description)
                : res.statusText
        throw new ApiRequestError(res.status, msg || "Pedido falhou", parsed)
    }
    return parsed as T
}

export async function apiJson<T>(path: string, method: string, body?: unknown): Promise<T> {
    return apiFetch<T>(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
}
