import { apiGet } from "@/infrastructure/apiClient"

export type PublicActiveCampaignBeach = {
    id: string
    name: string
    municipality: string | null
    latitude: number | null
    longitude: number | null
}

export type PublicActiveCampaign = {
    id: string
    title: string
    statusKey: string
    startDate: string
    endDate: string
    organizationName: string | null
    organizationMunicipality: string | null
    beaches: PublicActiveCampaignBeach[]
}

type PublicActiveCampaignsResponse = {
    data: PublicActiveCampaign[]
}

export async function fetchPublicActiveCampaigns(): Promise<PublicActiveCampaign[]> {
    const body = await apiGet<PublicActiveCampaignsResponse>("/campaigns/public/active")
    return body.data ?? []
}
