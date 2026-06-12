import type { CampaignListFilters, CampaignListItem } from "@/modules/campaigns/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { href } from "@/infrastructure/apiDiscovery"
import { getLink } from "@/infrastructure/hypermediaClient"
import { apiGet, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { isValidDistrictCode } from "@/shared/lib/districtCodes"

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

function emptyCampaignsPage(page: number, pageSize: number): CampaignsPageResult {
    return {
        items: [],
        page,
        pageSize,
        total: 0,
    }
}

// Obtém uma página da listagem de campanhas com filtros opcionais.
export async function fetchCampaignsPage(
    page: number,
    pageSize: number,
    filters?: CampaignListFilters,
    _prevLinks?: ResourceLinks,
): Promise<CampaignsPageResult> {
    if (filters?.district && !isValidDistrictCode(filters.district)) {
        return emptyCampaignsPage(page, pageSize)
    }

    const q = paginationQuery(page, pageSize)
    appendFilters(q, filters)

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
