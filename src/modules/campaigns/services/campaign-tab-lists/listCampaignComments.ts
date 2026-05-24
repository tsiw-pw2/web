import { unwrapList } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsComment } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"

export type ListCampaignCommentsQuery = {
    page: number
    pageSize: number
}

export async function listCampaignComments(
    campaignId: string,
    query: ListCampaignCommentsQuery,
): Promise<PaginatedResult<CampaignDetailsComment>> {
    const q = new URLSearchParams({
        page: String(query.page),
        pageSize: String(query.pageSize),
    })
    const body = await requestApiData<unknown>(
        `/campaigns/${campaignId}/comments?${q}`,
        { method: "GET" },
    )
    return unwrapList<CampaignDetailsComment>(body)
}
