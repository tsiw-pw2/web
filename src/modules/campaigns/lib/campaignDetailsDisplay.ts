import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { campaignStatusLabel } from "@/modules/campaigns/lib/campaignStatus"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import type { ApiStateBadge } from "@/shared/lib/apiStatePresentation"
import { formatDatePt } from "@/shared/lib/formatPt"
import { campaignStatusTableBadge } from "@/shared/lib/tableValueBadge"

// Normaliza e devolve a descrição da campanha para apresentação.
export function campaignDescriptionText(campaign: CampaignDetails | null): string {
    const raw = campaign?.description?.trim()
    if (!raw?.length) return "-"
    return raw.replace(/(\r?\n\s*){2,}/g, "\n").trim()
}

// Devolve o rótulo da fase/estado editável da campanha.
export function campaignPhaseLabel(campaign: CampaignDetails | null): string {
    return campaignStatusLabel(campaign?.editStatus)
}

// Devolve o rótulo do distrito da campanha.
export function campaignDistrictLabel(campaign: CampaignDetails | null): string {
    const code = campaign?.districtCode
    if (!code) return "-"
    return DISTRICT_SELECT_OPTIONS.find((o) => o.value === code)?.label ?? "-"
}

// Formata o intervalo de datas da campanha.
export function campaignPeriodLabel(campaign: CampaignDetails | null): string {
    if (!campaign) return "-"
    return `${formatDatePt(campaign.startDate)} - ${formatDatePt(campaign.endDate)}`
}

// Devolve distintivo UI do estado editável da campanha.
export function campaignStatusUi(campaign: CampaignDetails | null): ApiStateBadge {
    return campaignStatusTableBadge(campaign?.editStatus)
}
