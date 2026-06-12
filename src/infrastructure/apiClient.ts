import { getApiBaseUrl } from "./config"
import { getAccessToken } from "./access-token"
import { getActiveOrganizationId, ORG_HEADER_NAME } from "./active-organization"
import { tryRestoreSession } from "./authSession"
import { handleSessionExpired } from "./sessionExpired"
import { ApiServiceUnavailableError, apiUnavailableMessageFromResponse, shouldTreatResponseAsUnavailable } from "./apiErrors"
import type { PaginatedResult } from "@/types/pagination"

export const CLIENT_SAFE_REQUEST_FAILED = "Não foi possível concluir o pedido."

export class ApiRequestError extends Error {
    readonly httpStatus: number

    constructor(httpStatus: number, message?: string) {
        super(message ?? CLIENT_SAFE_REQUEST_FAILED)
        this.name = "ApiRequestError"
        this.httpStatus = httpStatus
    }
}

export function isApiRequestError(e: unknown): e is ApiRequestError {
    return e instanceof ApiRequestError
}

function resolveUrl(path: string): string {
    const base = getApiBaseUrl().replace(/\/$/, "")
    const p = path.startsWith("/") ? path : `/${path}`
    return `${base}${p}`
}

function isSessionManagementPath(path: string): boolean {
    return path === "/sessions" || path.startsWith("/sessions/")
}

function applyBearerHeader(headers: Headers) {
    const token = getAccessToken()
    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }
    const orgId = getActiveOrganizationId()
    if (orgId) {
        headers.set(ORG_HEADER_NAME, orgId)
    }
}

async function fetchWithAuth(path: string, init?: RequestInit, allowSessionRetry = true): Promise<Response> {
    const url = resolveUrl(path)
    const headers = new Headers(init?.headers)
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json")
    }
    applyBearerHeader(headers)
    const hadAccessToken = Boolean(getAccessToken())
    let res: Response
    try {
        res = await fetch(url, { ...init, headers, credentials: "include" })
    } catch {
        throw new ApiServiceUnavailableError()
    }
    if (res.status !== 401 || !allowSessionRetry || isSessionManagementPath(path)) {
        return res
    }
    const restored = await tryRestoreSession()
    if (!restored) {
        if (hadAccessToken) {
            handleSessionExpired()
        }
        return res
    }
    applyBearerHeader(headers)
    try {
        return await fetch(url, { ...init, headers, credentials: "include" })
    } catch {
        throw new ApiServiceUnavailableError()
    }
}

function extractErrorMessage(body: unknown): string | null {
    if (!body || typeof body !== "object") return null
    const o = body as Record<string, unknown>
    if (o.success === false && typeof o.message === "string") return o.message
    if (typeof o.msg === "string") return o.msg
    if (typeof o.message === "string") return o.message
    if (typeof o.description === "string") return o.description
    if (typeof o.error_description === "string") return o.error_description
    return null
}

async function readJsonResponse<T>(res: Response): Promise<T> {
    const rawText = await res.text()
    if (res.status === 204) {
        return null as T
    }
    if (shouldTreatResponseAsUnavailable(res, rawText)) {
        throw new ApiServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }
    let body: unknown = null
    try {
        if (rawText.trim().length > 0) {
            body = JSON.parse(rawText) as unknown
        }
    } catch {
        throw new ApiServiceUnavailableError(apiUnavailableMessageFromResponse(res, rawText))
    }
    if (!res.ok) {
        const msg = extractErrorMessage(body) ?? CLIENT_SAFE_REQUEST_FAILED
        throw new ApiRequestError(res.status, msg)
    }
    return body as T
}

export async function apiGet<T>(path: string, query?: URLSearchParams): Promise<T> {
    const href = query && query.toString() ? `${path}?${query}` : path
    const res = await fetchWithAuth(href)
    return readJsonResponse<T>(res)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithAuth(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return readJsonResponse<T>(res)
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithAuth(path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return readJsonResponse<T>(res)
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithAuth(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return readJsonResponse<T>(res)
}

export async function apiDelete(path: string, body?: unknown): Promise<void> {
    const res = await fetchWithAuth(path, {
        method: "DELETE",
        headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    await readJsonResponse<null>(res)
}

export async function apiPatchFormData<T>(path: string, formData: FormData): Promise<T> {
    const res = await fetchWithAuth(path, {
        method: "PATCH",
        body: formData,
    })
    return readJsonResponse<T>(res)
}

export function paginationQuery(page: number, pageSize: number): URLSearchParams {
    const q = new URLSearchParams()
    q.set("page", String(page))
    q.set("pageSize", String(pageSize))
    return q
}

type ListBody<T> = {
    data: T[]
    page?: number
    pageSize?: number
    total?: number
}

// Converter resposta de listagem da API para PaginatedResult
export function unwrapList<T>(body: ListBody<T>): PaginatedResult<T> {
    return {
        items: body.data ?? [],
        page: body.page ?? 1,
        pageSize: body.pageSize ?? body.data?.length ?? 0,
        total: body.total ?? body.data?.length ?? 0,
    }
}

export async function apiGetList<T>(path: string, page: number, pageSize: number): Promise<PaginatedResult<T>> {
    const body = await apiGet<ListBody<T>>(path, paginationQuery(page, pageSize))
    return unwrapList(body)
}
