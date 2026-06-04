import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { PaginatedResult } from "@/types/pagination"
import {
    fetchCampaignSubResourcePage,
    type CampaignLinkParent,
} from "@/modules/campaigns/services/campaignHypermedia"

export type ListCampaignRegistrationsQuery = {
    page: number
    pageSize: number
    status?: number
}

// Lista as inscrições de uma campanha de forma paginada.
export async function listCampaignRegistrations(
    campaign: CampaignLinkParent,
    query: ListCampaignRegistrationsQuery,
): Promise<PaginatedResult<CampaignDetailsRegistration>> {
    return fetchCampaignSubResourcePage<CampaignDetailsRegistration>(
        campaign,
        "registrations",
        "registrations",
        query.page,
        query.pageSize,
        query.status != null ? { status: String(query.status) } : undefined,
    )
}
