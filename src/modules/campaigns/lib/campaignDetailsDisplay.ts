import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import { campaignStatusLabel } from "@/modules/campaigns/lib/campaignStatus"
import { campaignDetailStatusBadge } from "@/shared/lib/apiStatePresentation"
import { formatDatePt } from "@/shared/lib/formatPt"

export function campaignDescriptionText(campaign: CampaignDetails | null): string {
    const raw = campaign?.description?.trim()
    if (!raw?.length) return "—"
    return raw.replace(/(\r?\n\s*){2,}/g, "\n").trim()
}

export function campaignPhaseLabel(campaign: CampaignDetails | null): string {
    return campaignStatusLabel(campaign?.editStatus)
}

export function campaignDistrictLabel(campaign: CampaignDetails | null): string {
    const code = campaign?.districtCode
    if (!code) return "—"
    return DISTRICT_SELECT_OPTIONS.find((o) => o.value === code)?.label ?? "—"
}

export function campaignPeriodLabel(campaign: CampaignDetails | null): string {
    if (!campaign) return "—"
    return `${formatDatePt(campaign.startDate)} — ${formatDatePt(campaign.endDate)}`
}

export function campaignStatusUi(campaign: CampaignDetails | null) {
    return campaignDetailStatusBadge(campaign?.status ?? 0)
}
