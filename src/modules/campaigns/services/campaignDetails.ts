import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetails } from "@/modules/campaigns/types/details"

export async function getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    return requestApiData<CampaignDetails>(`/campaigns/${campaignId}`, { method: "GET" })
}
