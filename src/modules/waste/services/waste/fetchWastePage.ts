import type { WasteListFilters, WasteListItem } from "@/modules/waste/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { followHref } from "@/infrastructure/hypermediaClient"

export type WastePageResult = PaginatedResult<WasteListItem> & {
    links?: ResourceLinks
}

// Acrescenta filtros de listagem aos parâmetros de consulta.
function appendFilters(q: URLSearchParams, filters?: WasteListFilters) {
    if (!filters) return
    if (filters.q) {
        q.set("q", filters.q)
    }
    if (filters.categories?.length) {
        for (const categoryId of filters.categories) {
            q.append("category", categoryId)
        }
    }
    if (filters.unit?.length) {
        for (const unit of filters.unit) {
            q.append("unit", unit)
        }
    }
}

// Obtém uma página da listagem de resíduos com filtros opcionais.
export async function fetchWastePage(
    page: number,
    pageSize: number,
    filters?: WasteListFilters,
    prevLinks?: ResourceLinks,
): Promise<WastePageResult> {
    const q = paginationQuery(page, pageSize)
    appendFilters(q, filters)

    if (page > 1 && prevLinks?.next?.href) {
        const body = await followHref<{
            data: WasteListItem[]
            page?: number
            pageSize?: number
            total?: number
            links?: ResourceLinks
        }>(prevLinks.next, { query: q })
        return { ...unwrapList(body), links: body.links }
    }

    const path = await href("wasteItems")
    const body = await apiGet<{
        data: WasteListItem[]
        page?: number
        pageSize?: number
        total?: number
        links?: ResourceLinks
    }>(path, q)
    return { ...unwrapList(body), links: body.links }
}
