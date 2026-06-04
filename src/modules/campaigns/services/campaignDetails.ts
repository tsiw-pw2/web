import { href } from "@/infrastructure/apiDiscovery"
import { apiGet } from "@/infrastructure/apiClient"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type CampaignDetailsResource = CampaignDetails & { links?: ResourceLinks }

// Obtém os detalhes de uma campanha pelo identificador.
export async function getCampaignDetails(campaignId: string): Promise<CampaignDetailsResource> {
    const base = await href("campaigns")
    return apiGet<CampaignDetailsResource>(`${base}/${campaignId}`)
}
