import { paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import { followHref, getLink } from "@/infrastructure/hypermediaClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import type { PaginatedResult } from "@/types/pagination"

export type CampaignLinkParent = {
    id: string
    links?: ResourceLinks
}

// Listar sub-recurso de campanha via links ou fallback por id.
export async function fetchCampaignSubResourcePage<T>(
    campaign: CampaignLinkParent,
    rel: string,
    segment: string,
    page: number,
    pageSize: number,
    extraParams?: Record<string, string | undefined>,
): Promise<PaginatedResult<T>> {
    const q = paginationQuery(page, pageSize)
    for (const [key, value] of Object.entries(extraParams ?? {})) {
        if (value != null && value !== "") q.set(key, value)
    }
    const link = getLink(campaign, rel)
    if (!link?.href) {
        throw new Error(`Campaign sub-resource link "${rel}" not available`)
    }
    const body = await followHref<{
        data: T[]
        page?: number
        pageSize?: number
        total?: number
    }>(link, { query: q })
    return unwrapList(body)
}
