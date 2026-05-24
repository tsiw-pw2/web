import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

export type SettingsUserActivityMetrics = {
    registrationsCount: number
    organizedCampaignsCount: number
    wasteCollectionsCount: number
    beachesCreatedCount: number
}

export type SettingsUserDetail = SettingsUserRow & {
    metrics: SettingsUserActivityMetrics
}

export type SettingsUserRegistrationCampaign = {
    id: string
    title: string
    startDate: string
    endDate: string
    status: number
}

export type SettingsUserRegistrationRow = {
    id: string
    role: number
    status: number
    attendance: boolean | null
    createdAt: string
    campaign: SettingsUserRegistrationCampaign | null
}

export type SettingsUserOrganizedCampaignRow = {
    id: string
    title: string
    startDate: string
    endDate: string
    status: number
    districtCode: string | null
}
