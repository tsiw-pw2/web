import type { BeachListFilters } from "@/modules/beaches/types/filters"
import type { BeachListItem } from "@/modules/beaches/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type BeachesPageResult = PaginatedResult<BeachListItem> & {
    links?: ResourceLinks
}

function appendFilters(q: URLSearchParams, filters?: BeachListFilters) {
    if (!filters?.q) return
    q.set("q", filters.q)
}

export function beachListFiltersSignature(filters?: BeachListFilters): string {
    return JSON.stringify({ q: filters?.q ?? "" })
}

// Obtém uma página da listagem de praias.
export async function fetchBeachesPage(
    page: number,
    pageSize: number,
    filters?: BeachListFilters,
    _prevLinks?: ResourceLinks,
): Promise<BeachesPageResult> {
    const q = paginationQuery(page, pageSize)
    appendFilters(q, filters)

    const path = await href("beaches")
    const body = await apiGet<{
        data: BeachListItem[]
        page?: number
        pageSize?: number
        total?: number
        links?: ResourceLinks
    }>(path, q)
    return { ...unwrapList(body), links: body.links }
}
