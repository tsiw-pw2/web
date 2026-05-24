import type { CampaignListFilters, CampaignListItem } from "@/modules/campaigns/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { unwrapList } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

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

export async function fetchCampaignsPage(
    page: number,
    pageSize: number,
    filters?: CampaignListFilters,
): Promise<PaginatedResult<CampaignListItem>> {
    const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })
    appendFilters(q, filters)
    const body = await requestApiData<unknown>(`/campaigns?${q}`, { method: "GET" })
    return unwrapList<CampaignListItem>(body)
}
