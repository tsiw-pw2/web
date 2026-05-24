import type { PaginatedResult } from "@/types/pagination"

type HateoasLink = { href: string; method?: string }

export type HateoasListBody<T> = {
    data: T[]
    links?: Record<string, HateoasLink>
    page?: number
    pageSize?: number
    total?: number
}

export function unwrapResource<T>(body: unknown): T {
    if (!body || typeof body !== "object") {
        return body as T
    }
    const record = body as Record<string, unknown>
    const { links: _links, ...rest } = record
    return rest as T
}

export function unwrapList<T>(body: unknown): PaginatedResult<T> {
    if (!body || typeof body !== "object") {
        return { items: [], page: 1, pageSize: 10, total: 0 }
    }
    const record = body as HateoasListBody<T>
    const items = Array.isArray(record.data)
        ? record.data.map((row) => unwrapResource<T>(row))
        : []
    return {
        items,
        page: typeof record.page === "number" ? record.page : 1,
        pageSize: typeof record.pageSize === "number" ? record.pageSize : items.length,
        total: typeof record.total === "number" ? record.total : items.length
    }
}

export function unwrapSessionResource(body: unknown): { token: string; user: Record<string, unknown> } {
    if (!body || typeof body !== "object") {
        throw new Error("Invalid session response")
    }
    const record = body as Record<string, unknown>
    const nested = record.session
    const session =
        nested && typeof nested === "object" ? (nested as Record<string, unknown>) : null
    const token =
        typeof record.token === "string"
            ? record.token
            : session && typeof session.token === "string"
              ? session.token
              : ""
    const user = unwrapResource<Record<string, unknown>>(record.user ?? record)
    return { token, user }
}
