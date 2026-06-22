import type { PublicCampaignMapPin } from "@/modules/home/types/publicCampaignMap"
import { apiGet } from "@/infrastructure/apiClient"

type PublicCampaignMapResponse = {
    items: PublicCampaignMapPin[]
}

// Obtém pinos de campanhas activas para o mapa público da homepage (sem autenticação).
export async function fetchPublicCampaignMap(): Promise<PublicCampaignMapPin[]> {
    const data = await apiGet<PublicCampaignMapResponse>("/campaigns/public-map")
    return Array.isArray(data.items) ? data.items : []
}
