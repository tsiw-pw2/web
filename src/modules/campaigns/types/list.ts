import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"

export type CampaignListFilters = {
    q?: string
    status?: CampaignStatusKey[]
    district?: string
}

export type CampaignListItem = {
    id: string
    title: string
    municipality: string
    beach: string
    startDate: string
    endDate: string
    statusKey?: CampaignStatusKey
    districtCode?: string | null
}

export type CampaignCreateDraft = {
    title: string
    meetingTime: string
    startDate: string
    endDate: string
    status: string
    information: string
    district?: string
    beachIds?: string[]
}
