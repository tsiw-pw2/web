export type DashboardKeyValueRow = {
    label: string
    value: string
}

export type DashboardOverview = {
    metrics: {
        campaignCount: number
        beachCount: number
        volunteerCount: number
    }
    cleaningStatsRows: DashboardKeyValueRow[]
    nextCampaignRows: DashboardKeyValueRow[]
    nextCampaignId: string | null
}
