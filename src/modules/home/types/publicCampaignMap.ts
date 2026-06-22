import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"

export type PublicCampaignMapPin = {
    beachId: string
    beachName: string
    latitude: string
    longitude: string
    municipality: string | null
    district: string | null
    campaignId: string
    title: string
    startDate: string
    endDate: string
    status: CampaignStatusKey
}
