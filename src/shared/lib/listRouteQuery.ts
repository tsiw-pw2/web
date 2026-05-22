import type { LocationQuery } from "vue-router"

export type PaginationQueryKeys = {
    page: string
    pageSize: string
}

export function parsePageFromRouteQuery(query: LocationQuery, key: string): number | undefined {
    const raw = query[key]
    const s = Array.isArray(raw) ? raw[0] : raw
    if (typeof s !== "string" || s === "") return undefined
    const n = Number.parseInt(s, 10)
    if (!Number.isFinite(n) || n < 1) return undefined
    return n
}

export function parsePageSizeFromRouteQuery(query: LocationQuery, key: string, maxPageSize: number): number | undefined {
    const raw = query[key]
    const s = Array.isArray(raw) ? raw[0] : raw
    if (typeof s !== "string" || s === "") return undefined
    const n = Number.parseInt(s, 10)
    if (!Number.isFinite(n) || n < 1 || n > maxPageSize) return undefined
    return n
}

export function mergeRouteQueryWithPagination(query: LocationQuery, page: number, pageSize: number, defaultPageSize: number, keys: PaginationQueryKeys): LocationQuery {
    const next: LocationQuery = { ...query }
    if (page <= 1) {
        delete next[keys.page]
    } else {
        next[keys.page] = String(page)
    }
    if (pageSize === defaultPageSize) {
        delete next[keys.pageSize]
    } else {
        next[keys.pageSize] = String(pageSize)
    }
    return next
}
