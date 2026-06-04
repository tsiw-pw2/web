import type { CampaignListFilters, CampaignListItem } from "@/modules/campaigns/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { followHref, getLink } from "@/infrastructure/hypermediaClient"

export type CampaignsPageResult = PaginatedResult<CampaignListItem> & {
    links?: ResourceLinks
}

// Acrescenta filtros de listagem aos parâmetros de consulta.
function appendFilters(q: URLSearchParams, filters?: CampaignListFilters) {
    if (!filters) return
    if (filters.q) {
        q.set("q", filters.q)
    }
    if (filters.status?.length) {
        for (const status of filters.status) {
            q.append("status", status)
        }
    }
    if (filters.district) {
        q.set("district", filters.district)
    }
}

// Obtém uma página da listagem de campanhas com filtros opcionais.
export async function fetchCampaignsPage(
    page: number,
    pageSize: number,
    filters?: CampaignListFilters,
    prevLinks?: ResourceLinks,
): Promise<CampaignsPageResult> {
    const q = paginationQuery(page, pageSize)
    appendFilters(q, filters)

    if (page > 1 && prevLinks?.next?.href) {
        const body = await followHref<{
            data: CampaignListItem[]
            page?: number
            pageSize?: number
            total?: number
            links?: ResourceLinks
        }>(prevLinks.next, { query: q })
        return { ...unwrapList(body), links: body.links }
    }

    const path = await href("campaigns")
    const body = await apiGet<{
        data: CampaignListItem[]
        page?: number
        pageSize?: number
        total?: number
        links?: ResourceLinks
    }>(path, q)
    return { ...unwrapList(body), links: body.links }
}

// Seguir self de um item da listagem para obter detalhe (opcional).
export function campaignItemSelfHref(item: CampaignListItem & { links?: ResourceLinks }): string | null {
    return getLink(item, "self")?.href ?? null
}
