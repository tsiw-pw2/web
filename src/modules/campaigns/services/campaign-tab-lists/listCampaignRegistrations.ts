import { unwrapList } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"

export type ListCampaignRegistrationsQuery = {
    page: number
    pageSize: number
    status?: number
}

export async function listCampaignRegistrations(
    campaignId: string,
    query: ListCampaignRegistrationsQuery,
): Promise<PaginatedResult<CampaignDetailsRegistration>> {
    const q = new URLSearchParams({
        page: String(query.page),
        pageSize: String(query.pageSize),
    })
    if (query.status != null) {
        q.set("status", String(query.status))
    }
    const body = await requestApiData<unknown>(
        `/campaigns/${campaignId}/registrations?${q}`,
        { method: "GET" },
    )
    return unwrapList<CampaignDetailsRegistration>(body)
}
