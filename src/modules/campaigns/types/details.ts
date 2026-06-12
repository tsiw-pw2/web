import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type CampaignDetailsOrganizer = {
    id: string
    name: string
}

export type CampaignDetailsBeach = {
    id: string
    name: string
    latitude: string
    longitude: string
    district: string | null
    municipality: string | null
    parish: string | null
}

export type CampaignDetailsRegistrationUser = {
    id: string
    name: string
    email: string
    phone: string | null
}

export type CampaignDetailsRegistration = {
    id: string
    role: number
    status: number
    attendance: boolean | null
    createdAt?: string
    user?: CampaignDetailsRegistrationUser | null
    links?: ResourceLinks
}

export type CampaignDetailsViewerRegistration = {
    id: string
    userId: string
    role: number
    status: number
    attendance: boolean | null
    links?: ResourceLinks
}

export type CampaignDetailsComment = {
    id: string
    body: string
    createdAt: string
    user: { id: string; name: string } | null
    isVisible?: boolean
    links?: ResourceLinks
}

export type CampaignDetailsWasteCollection = {
    id: string
    unitQuantity: number
    actualWeightKg: string | null
    estimatedWeightKg: string | null
    createdAt: string
    beach: { id: string; name: string } | null
    waste: { id: string; name: string } | null
    recordedBy: { id: string; name: string } | null
    links?: ResourceLinks
}

export type CampaignWasteByTypeRow = {
    typeName: string
    units: number
    weightKg: number
}

export type CampaignDetailsMetrics = {
    beachesCount: number
    registrationsCount: number
    pendingRegistrationsCount: number
    commentsCount: number
    wasteCollectionsCount: number
    totalWasteUnits: number
    totalWasteWeightKg: number
    totalActualWeightKg: number
    totalImpactWeightKg: number
    wasteByType: CampaignWasteByTypeRow[]
}

export type CampaignDetails = {
    id: string
    links?: ResourceLinks
    title: string
    description: string | null
    meetingLocation: string
    meetingTime: string | null
    startDate: string
    endDate: string
    districtCode: string | null
    status: number
    editStatus: CampaignStatusKey
    organizer: CampaignDetailsOrganizer | null
    beaches: CampaignDetailsBeach[]
    metrics: CampaignDetailsMetrics
    viewerCanPostComment: boolean
    viewerCanEnroll: boolean
    viewerRegistration: CampaignDetailsViewerRegistration | null
}
