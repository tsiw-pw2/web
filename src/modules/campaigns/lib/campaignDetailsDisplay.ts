import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { campaignStatusLabel, type CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import { DISTRICT_SELECT_OPTIONS } from "@/shared/constants/districtSelectOptions"
import type { ApiStateBadge } from "@/shared/lib/apiStatePresentation"
import { formatDatePt } from "@/shared/lib/formatPt"

const campaignDetailRingBadge =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"

const EDIT_STATUS_RING: Record<CampaignStatusKey, string> = {
    planeada: "bg-neutral-50 text-neutral-700 ring-neutral-200",
    aberta_inscricoes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    encerrada_inscricoes: "bg-amber-50 text-amber-800 ring-amber-200",
    em_progresso: "bg-sky-50 text-sky-700 ring-sky-200",
    concluida: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelada: "bg-red-50 text-red-700 ring-red-200",
}

// Normaliza e devolve a descrição da campanha para apresentação.
export function campaignDescriptionText(campaign: CampaignDetails | null): string {
    const raw = campaign?.description?.trim()
    if (!raw?.length) return "—"
    return raw.replace(/(\r?\n\s*){2,}/g, "\n").trim()
}

// Devolve o rótulo da fase/estado editável da campanha.
export function campaignPhaseLabel(campaign: CampaignDetails | null): string {
    return campaignStatusLabel(campaign?.editStatus)
}

// Devolve o rótulo do distrito da campanha.
export function campaignDistrictLabel(campaign: CampaignDetails | null): string {
    const code = campaign?.districtCode
    if (!code) return "—"
    return DISTRICT_SELECT_OPTIONS.find((o) => o.value === code)?.label ?? "—"
}

// Formata o intervalo de datas da campanha.
export function campaignPeriodLabel(campaign: CampaignDetails | null): string {
    if (!campaign) return "—"
    return `${formatDatePt(campaign.startDate)} — ${formatDatePt(campaign.endDate)}`
}

// Devolve distintivo UI do estado editável da campanha.
export function campaignStatusUi(campaign: CampaignDetails | null): ApiStateBadge {
    const key = campaign?.editStatus
    if (!key) {
        return {
            label: "—",
            className: `${campaignDetailRingBadge} bg-neutral-50 text-neutral-700 ring-neutral-200`,
        }
    }
    return {
        label: campaignStatusLabel(key),
        className: `${campaignDetailRingBadge} ${EDIT_STATUS_RING[key] ?? EDIT_STATUS_RING.planeada}`,
    }
}
