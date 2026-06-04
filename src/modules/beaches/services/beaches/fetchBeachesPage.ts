import type { BeachListItem } from "@/modules/beaches/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { followHref } from "@/infrastructure/hypermediaClient"

export type BeachesPageResult = PaginatedResult<BeachListItem> & {
    links?: ResourceLinks
}

// Obtém uma página da listagem de praias.
export async function fetchBeachesPage(
    page: number,
    pageSize: number,
    prevLinks?: ResourceLinks,
): Promise<BeachesPageResult> {
    const q = paginationQuery(page, pageSize)

    if (page > 1 && prevLinks?.next?.href) {
        const body = await followHref<{
            data: BeachListItem[]
            page?: number
            pageSize?: number
            total?: number
            links?: ResourceLinks
        }>(prevLinks.next, { query: q })
        return { ...unwrapList(body), links: body.links }
    }

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
