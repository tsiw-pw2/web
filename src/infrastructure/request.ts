import { getApiBaseUrl } from "./config"
import { getAccessToken, setAccessToken } from "./access-token"

export const CLIENT_SAFE_REQUEST_FAILED = "Não foi possível concluir o pedido."

export class ApiRequestError extends Error {
    readonly httpStatus: number

    constructor(httpStatus: number, message?: string) {
        super(message ?? CLIENT_SAFE_REQUEST_FAILED)
        this.name = "ApiRequestError"
        this.httpStatus = httpStatus
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export function isApiRequestError(e: unknown): e is ApiRequestError {
    return e instanceof ApiRequestError
}

let refreshInFlight: Promise<boolean> | null = null

function debugLogRequestFailure(label: string, path: string, init: RequestInit | undefined, httpStatus: number, bodyMessage?: string) {
    if (!import.meta.env.DEV) return
    const method = (init?.method ?? "GET").toUpperCase()
    const suffix = typeof bodyMessage === "string" && bodyMessage.length > 0 ? ` ${bodyMessage}` : ""
    console.debug(`[${label}]`, method, path, `HTTP ${httpStatus}`, suffix)
}

async function parseJsonBody(res: Response): Promise<unknown> {
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text) as unknown
    } catch {
        return null
    }
}

export async function tryRefreshAccessToken(): Promise<boolean> {
    if (refreshInFlight) {
        return refreshInFlight
    }
    const run = async (): Promise<boolean> => {
        try {
            const url = `${getApiBaseUrl()}/auth/refresh`
            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/json" },
            })
            const body = (await parseJsonBody(res)) as {
                success?: boolean
                data?: { accessToken?: string }
            } | null
            if (!res.ok || !body?.success || !body?.data?.accessToken) {
                if (res.status === 401 || res.status === 403) {
                    setAccessToken(null)
                }
                return false
            }
            setAccessToken(body.data.accessToken)
            return true
        } catch {
            return false
        }
    }
    const done = run().finally(() => {
        refreshInFlight = null
    })
    refreshInFlight = done
    return done
}

async function fetchWithAuth(url: string, init?: RequestInit, isRetry = false): Promise<Response> {
    const headers = new Headers(init?.headers)
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json")
    }
    const token = getAccessToken()
    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }
    const res = await fetch(url, {
        ...init,
        credentials: "include",
        headers,
    })
    if (res.status === 401 && !isRetry) {
        const refreshed = await tryRefreshAccessToken()
        if (refreshed) {
            return fetchWithAuth(url, init, true)
        }
    }
    return res
}

export async function requestApiData<T>(path: string, init?: RequestInit): Promise<T> {
    const base = getApiBaseUrl()
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    const url = `${base}${normalizedPath}`
    const method = (init?.method ?? "GET").toUpperCase()
    let res: Response
    try {
        res = await fetchWithAuth(url, init)
    } catch (e) {
        if (import.meta.env.DEV) {
            console.debug("[requestApiData] fetch threw", normalizedPath, method, e)
        }
        throw e
    }
    const body = (await parseJsonBody(res)) as {
        success?: boolean
        data?: T
        message?: string
    } | null
    if (!res.ok) {
        debugLogRequestFailure("requestApiData", normalizedPath, init, res.status, typeof body?.message === "string" ? body.message : undefined)
        throw new ApiRequestError(res.status)
    }
    if (!body || body.success !== true) {
        const inferred = res.ok ? 400 : res.status
        debugLogRequestFailure("requestApiData", normalizedPath, init, inferred, typeof body?.message === "string" ? body.message : undefined)
        throw new ApiRequestError(inferred)
    }
    return body.data as T
}

export async function requestApiFormData<T>(path: string, formData: FormData, options?: { method?: string }): Promise<T> {
    const base = getApiBaseUrl()
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    const url = `${base}${normalizedPath}`
    const method = options?.method ?? "POST"
    const res = await fetchWithAuth(url, {
        method,
        body: formData,
    })
    const body = (await parseJsonBody(res)) as {
        success?: boolean
        data?: T
        message?: string
    } | null
    if (!res.ok) {
        debugLogRequestFailure("requestApiFormData", normalizedPath, { method }, res.status, typeof body?.message === "string" ? body.message : undefined)
        throw new ApiRequestError(res.status)
    }
    if (!body || body.success !== true) {
        const inferred = res.ok ? 400 : res.status
        debugLogRequestFailure("requestApiFormData", normalizedPath, { method }, inferred, typeof body?.message === "string" ? body.message : undefined)
        throw new ApiRequestError(inferred)
    }
    return body.data as T
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const base = getApiBaseUrl()
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    const url = `${base}${normalizedPath}`
    const res = await fetchWithAuth(url, init)
    const body = await parseJsonBody(res)
    if (!res.ok) {
        throw new ApiRequestError(res.status)
    }
    return body as T
}
