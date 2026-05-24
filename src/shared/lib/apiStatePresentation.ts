export type ApiStateBadge = {
    label: string
    className: string
}

const campaignDetailRingBadge = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"

export function campaignDetailStatusBadge(status: number): ApiStateBadge {
    if (status === 2) {
        return {
            label: "Concluída",
            className: `${campaignDetailRingBadge} bg-emerald-50 text-emerald-700 ring-emerald-200`,
        }
    }
    if (status === 1) {
        return {
            label: "Ativa",
            className: `${campaignDetailRingBadge} bg-sky-50 text-sky-700 ring-sky-200`,
        }
    }
    return {
        label: "Rascunho",
        className: `${campaignDetailRingBadge} bg-neutral-50 text-neutral-700 ring-neutral-200`,
    }
}

import { CAMPAIGN_STATUS_SELECT_OPTIONS, type CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"

export const CAMPAIGN_EDIT_STATUS_ITEMS = CAMPAIGN_STATUS_SELECT_OPTIONS.map((o) => ({
    apiKey: o.value,
    label: o.label,
    db: o.value,
})) as { apiKey: CampaignStatusKey; label: string; db: string }[]

export function userAccountStateBadge(isBlocked: boolean): ApiStateBadge {
    if (isBlocked) {
        return {
            label: "Bloqueado",
            className:
                "inline-flex max-h-7 items-center rounded-full bg-red-50 px-2 py-0 text-xs font-semibold leading-none text-red-700",
        }
    }
    return {
        label: "Ativo",
        className:
            "inline-flex max-h-7 items-center rounded-full bg-emerald-50 px-2 py-0 text-xs font-semibold leading-none text-emerald-800",
    }
}

export const COMMENT_HIDDEN_BADGE: ApiStateBadge = {
    label: "Oculto",
    className:
        "shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700",
}

export const REGISTRATION_STATUS_ITEMS = [
    { value: 0, label: "Pendente" },
    { value: 1, label: "Confirmada" },
    { value: 2, label: "Cancelada" },
] as const

export const REGISTRATION_ROLE_ITEMS = [
    { value: 0, label: "Voluntário" },
    { value: 1, label: "Organizador" },
] as const

export const WASTE_CATEGORY_ITEMS = [
    { apiKey: "plastic", label: "Plástico" },
    { apiKey: "glass", label: "Vidro" },
    { apiKey: "metal", label: "Metal" },
    { apiKey: "paper", label: "Papel / cartão" },
    { apiKey: "organic", label: "Orgânico" },
    { apiKey: "other", label: "Outro" },
] as const

export const WASTE_UNIT_ITEMS = [
    { apiKey: "unit", label: "Unidade" },
    { apiKey: "peso", label: "Peso" },
] as const
