import { getApiBaseUrl } from "./config"
import { getAccessToken } from "./access-token"
import { tryRestoreSession } from "./authSession"
import {
    ApiServiceUnavailableError,
    apiUnavailableMessageFromResponse,
    shouldTreatResponseAsUnavailable,
} from "./apiErrors"

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

export { ApiServiceUnavailableError, isApiServiceUnavailableError } from "./apiErrors"

function debugLogRequestFailure(label: string, path: string, init: RequestInit | undefined, httpStatus: number, bodyMessage?: string) {
    if (!import.meta.env.DEV) return
    const method = (init?.method ?? "GET").toUpperCase()
    const suffix = typeof bodyMessage === "string" && bodyMessage.length > 0 ? ` ${bodyMessage}` : ""
    console.debug(`[${label}]`, method, path, `HTTP ${httpStatus}`, suffix)
}

function parseJsonText(rawText: string): unknown {
    if (!rawText.trim()) return null
    return JSON.parse(rawText) as unknown
}

function isSessionManagementPath(path: string): boolean {
    return path === "/sessions" || path === "/sessions/current"
}

function applyBearerHeader(headers: Headers) {
    const token = getAccessToken()
    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }
}

async function fetchWithAuth(url: string, init?: RequestInit, allowSessionRetry = true): Promise<Response> {
    const headers = new Headers(init?.headers)
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json")
    }
    applyBearerHeader(headers)
    let res: Response
    try {
        res = await fetch(url, {
            ...init,
            headers,
            credentials: "include",
        })
    } catch (e) {
        if (import.meta.env.DEV) {
            console.debug("[fetchWithAuth] fetch threw", url, e)
        }
        throw new ApiServiceUnavailableError()
    }
    if (res.status !== 401 || !allowSessionRetry) {
        return res
    }
    const path = new URL(url, "http://local.invalid").pathname
    if (isSessionManagementPath(path)) {
        return res
    }
    const restored = await tryRestoreSession()
    if (!restored) {
        return res
    }
    applyBearerHeader(headers)
    try {
        return await fetch(url, {
            ...init,
            headers,
            credentials: "include",
        })
    } catch (e) {
        if (import.meta.env.DEV) {
            console.debug("[fetchWithAuth] retry fetch threw", url, e)
        }
        throw new ApiServiceUnavailableError()
    }
}

async function readApiResponse<T>(res: Response, normalizedPath: string, init: RequestInit | undefined): Promise<T> {
    const rawText = await res.text()
    if (res.status === 204) {
        return null as T
    }

    if (shouldTreatResponseAsUnavailable(res, rawText)) {
        throw new ApiServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }

    let body: unknown = null
    try {
        if (rawText.trim().length === 0 && !res.ok) {
            throw new SyntaxError("empty")
        }
        body = parseJsonText(rawText)
    } catch {
        throw new ApiServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }

    if (!res.ok) {
        const msg =
            body && typeof body === "object" && body !== null && "message" in body
                ? String((body as { message?: unknown }).message ?? "")
                : undefined
        const safeMsg = msg && msg.length > 0 ? msg : undefined
        debugLogRequestFailure("requestApi", normalizedPath, init, res.status, safeMsg)
        throw new ApiRequestError(res.status, safeMsg)
    }

    return body as T
}

export async function requestApiData<T>(path: string, init?: RequestInit): Promise<T> {
    const base = getApiBaseUrl()
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    const url = `${base}${normalizedPath}`
    const res = await fetchWithAuth(url, init)
    return readApiResponse<T>(res, normalizedPath, init)
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
    return readApiResponse<T>(res, normalizedPath, { method })
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const base = getApiBaseUrl()
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    const url = `${base}${normalizedPath}`
    const res = await fetchWithAuth(url, init)
    return readApiResponse<T>(res, normalizedPath, init)
}
