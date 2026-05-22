import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"

export type ListCampaignRegistrationsQuery = {
    page: number
    pageSize: number
}

export async function listCampaignRegistrations(
    campaignId: string,
    query: ListCampaignRegistrationsQuery,
): Promise<PaginatedResult<CampaignDetailsRegistration>> {
    const q = new URLSearchParams({
        page: String(query.page),
        pageSize: String(query.pageSize),
    })
    return requestApiData<PaginatedResult<CampaignDetailsRegistration>>(
        `/campaigns/${campaignId}/registrations?${q}`,
        { method: "GET" },
    )
}
