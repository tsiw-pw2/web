import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"

export type ListCampaignWasteCollectionsQuery = {
    page: number
    pageSize: number
    beachId?: string
}

export async function listCampaignWasteCollections(
    campaignId: string,
    query: ListCampaignWasteCollectionsQuery,
): Promise<PaginatedResult<CampaignDetailsWasteCollection>> {
    const q = new URLSearchParams({
        page: String(query.page),
        pageSize: String(query.pageSize),
    })
    if (query.beachId) {
        q.set("beachId", query.beachId)
    }
    return requestApiData<PaginatedResult<CampaignDetailsWasteCollection>>(
        `/campaigns/${campaignId}/waste-collections?${q}`,
        { method: "GET" },
    )
}
