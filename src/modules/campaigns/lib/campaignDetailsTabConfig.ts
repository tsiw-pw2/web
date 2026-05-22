import type { CampaignDetailsTabId } from "@/modules/campaigns/lib/campaignDetailsTabs"

export type CampaignDetailsTabConfig = {
    id: CampaignDetailsTabId
    label: string
}

export const CAMPAIGN_DETAILS_TAB_CONFIG: CampaignDetailsTabConfig[] = [
    { id: "informacoes", label: "Informações" },
    { id: "praias", label: "Praias" },
    { id: "voluntarios", label: "Voluntários" },
    { id: "recolhas", label: "Recolhas" },
    { id: "comentarios", label: "Comentários" },
]

export function visibleCampaignDetailsTabs(canManageRegistrations: boolean): CampaignDetailsTabConfig[] {
    if (canManageRegistrations) {
        return CAMPAIGN_DETAILS_TAB_CONFIG
    }
    return CAMPAIGN_DETAILS_TAB_CONFIG.filter((t) => t.id !== "voluntarios")
}
