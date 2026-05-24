import { unwrapResource } from "@/infrastructure/hateoas"
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
    const resBody = await requestApiData<unknown>(`/campaigns/${campaignId}/waste-collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    return unwrapResource<CampaignDetailsWasteCollection>(resBody)
}

export async function deleteCampaignWasteCollection(campaignId: string, collectionId: string): Promise<void> {
    await requestApiData<null>(`/campaigns/${campaignId}/waste-collections/${collectionId}`, {
        method: "DELETE",
    })
}
