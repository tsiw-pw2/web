import type { CampaignListItem } from "@/modules/campaigns/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { requestApiData } from "@/infrastructure/request"

export async function fetchCampaignsPage(page: number, pageSize: number): Promise<PaginatedResult<CampaignListItem>> {
    const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })
    return requestApiData<PaginatedResult<CampaignListItem>>(`/campaigns?${q}`, { method: "GET" })
}
