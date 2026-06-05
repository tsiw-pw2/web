export type DashboardKeyValueRow = {
    label: string
    value: string
}

export type DashboardMonthlyTrendPoint = {
    month: string
    weightKg: number
    units: number
}

export type DashboardTopBeachRow = {
    beachId: string
    name: string
    collectionsCount: number
    weightKg: number
}

export type DashboardOverview = {
    metrics: {
        campaignCount: number
        beachCount: number
        userCount: number
    }
    cleaningStatsRows: DashboardKeyValueRow[]
    wasteByTypeRows: DashboardKeyValueRow[]
    monthlyTrend: DashboardMonthlyTrendPoint[]
    topBeaches: DashboardTopBeachRow[]
    nextCampaignRows: DashboardKeyValueRow[]
    nextCampaignId: string | null
}
