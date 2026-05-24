import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetails } from "@/modules/campaigns/types/details"

export async function getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    const body = await requestApiData<unknown>(`/campaigns/${campaignId}`, { method: "GET" })
    return unwrapResource<CampaignDetails>(body)
}
