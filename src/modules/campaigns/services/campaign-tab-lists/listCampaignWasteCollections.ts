import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"
import {
    fetchCampaignSubResourcePage,
    type CampaignLinkParent,
} from "@/modules/campaigns/services/campaignHypermedia"

export type ListCampaignWasteCollectionsQuery = {
    page: number
    pageSize: number
    beachId?: string
}

// Lista as recolhas de resíduos de uma campanha de forma paginada.
export async function listCampaignWasteCollections(
    campaign: CampaignLinkParent,
    query: ListCampaignWasteCollectionsQuery,
): Promise<PaginatedResult<CampaignDetailsWasteCollection>> {
    return fetchCampaignSubResourcePage<CampaignDetailsWasteCollection>(
        campaign,
        "wasteCollections",
        "waste-collections",
        query.page,
        query.pageSize,
        query.beachId ? { beachId: query.beachId } : undefined,
    )
}
