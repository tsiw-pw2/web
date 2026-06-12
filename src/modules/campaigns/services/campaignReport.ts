import { apiGet } from "@/infrastructure/apiClient"
import { getApiBaseUrl } from "@/infrastructure/config"
import { getAccessToken } from "@/infrastructure/access-token"
import { getActiveOrganizationId, ORG_HEADER_NAME } from "@/infrastructure/active-organization"

export type CampaignReportBeach = {
    id: string
    name: string
    municipality: string | null
    district: string | null
}

export type CampaignReportWasteCollection = {
    wasteName: string
    wasteType: string | null
    unitQuantity: number
    actualWeightKg: number
}

export type CampaignReportWasteByBeach = {
    beachId: string
    beachName: string
    collections: CampaignReportWasteCollection[]
    totalUnits: number
    totalWeightKg: number
}

export type CampaignReportWasteByType = {
    wasteType: string
    totalUnits: number
    totalWeightKg: number
}

export type CampaignReportVolunteers = {
    total: number
    pending: number
    confirmed: number
    cancelled: number
    present: number
    absent: number
    attendanceRate: number
}

export type CampaignReport = {
    id: string
    referenceCode: string
    title: string
    statusLabel: string
    organizationName: string | null
    organizationMunicipality: string | null
    organizerName: string | null
    district: string | null
    description: string | null
    startDate: string
    endDate: string
    meetingLocation: string
    meetingTime: string | null
    beaches: CampaignReportBeach[]
    volunteers: CampaignReportVolunteers
    waste: {
        totalUnits: number
        totalActualWeightKg: number
        totalImpactWeightKg: number
        byType: CampaignReportWasteByType[]
        byBeach: CampaignReportWasteByBeach[]
    }
    generatedAt: string
}

export async function fetchCampaignReport(campaignId: string): Promise<CampaignReport> {
    return apiGet<CampaignReport>(`/campaigns/${campaignId}/report`)
}

export function campaignReportPdfUrl(campaignId: string): string {
    const base = getApiBaseUrl().replace(/\/$/, "")
    return `${base}/campaigns/${campaignId}/report.pdf`
}

export async function downloadCampaignReportPdf(campaignId: string): Promise<void> {
    const url = campaignReportPdfUrl(campaignId)
    const headers = new Headers({ Accept: "application/pdf" })
    const token = getAccessToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
    const orgId = getActiveOrganizationId()
    if (orgId) headers.set(ORG_HEADER_NAME, orgId)

    const res = await fetch(url, { headers, credentials: "include" })
    if (!res.ok) throw new Error("Não foi possível descarregar o PDF")

    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = `relatorio-${campaignId}.pdf`
    anchor.click()
    URL.revokeObjectURL(objectUrl)
}
