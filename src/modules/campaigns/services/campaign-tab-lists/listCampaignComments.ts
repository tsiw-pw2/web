import type { CampaignDetailsComment } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"
import {
    fetchCampaignSubResourcePage,
    type CampaignLinkParent,
} from "@/modules/campaigns/services/campaignHypermedia"

export type ListCampaignCommentsQuery = {
    page: number
    pageSize: number
}

// Lista os comentários de uma campanha de forma paginada.
export async function listCampaignComments(
    campaign: CampaignLinkParent,
    query: ListCampaignCommentsQuery,
): Promise<PaginatedResult<CampaignDetailsComment>> {
    return fetchCampaignSubResourcePage<CampaignDetailsComment>(
        campaign,
        "comments",
        "comments",
        query.page,
        query.pageSize,
    )
}
