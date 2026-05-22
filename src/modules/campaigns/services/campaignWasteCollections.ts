import { requestApiData } from "@/infrastructure/request"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"

export type CreateCampaignWasteCollectionBody = {
    beachId: string
    wasteId: string
    unitQuantity: number
    actualWeightKg?: number | null
}

export async function postCampaignWasteCollection(
    campaignId: string,
    body: CreateCampaignWasteCollectionBody,
): Promise<CampaignDetailsWasteCollection> {
    return requestApiData<CampaignDetailsWasteCollection>(`/campaigns/${campaignId}/waste-collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
}
