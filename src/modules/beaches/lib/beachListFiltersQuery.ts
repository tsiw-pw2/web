import type { BeachListFilters } from "@/modules/beaches/types/filters"

export const BEACH_LIST_MAX_SEARCH_LENGTH = 100

export function parseBeachListSearch(raw: unknown): string {
    if (typeof raw !== "string" || raw === "") return ""
    return raw.trim().slice(0, BEACH_LIST_MAX_SEARCH_LENGTH)
}

export function readBeachListFiltersFromQuery(query: Record<string, unknown>): BeachListFilters {
    const q = parseBeachListSearch(query.q)
    return q ? { q } : {}
}

export function beachListFilterQuerySignature(query: Record<string, unknown>): string {
    const parsed = readBeachListFiltersFromQuery(query)
    return JSON.stringify({ q: parsed.q ?? "" })
}
