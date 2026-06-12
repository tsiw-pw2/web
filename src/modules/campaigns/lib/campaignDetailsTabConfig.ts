import type { CampaignDetailsTabId } from "@/modules/campaigns/lib/campaignDetailsTabs"
import { canAccessCampaignComments } from "@/modules/campaigns/lib/canAccessCampaignComments"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"

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

// Lista separadores visíveis consoante permissões de gestão e hypermedia da campanha.
export function visibleCampaignDetailsTabs(
    canManageRegistrations: boolean,
    campaign?: (CampaignLinkParent & { editStatus?: string }) | null,
): CampaignDetailsTabConfig[] {
    return CAMPAIGN_DETAILS_TAB_CONFIG.filter((tab) => {
        if (tab.id === "voluntarios" && !canManageRegistrations) return false
        if (tab.id === "comentarios" && !canAccessCampaignComments(campaign)) return false
        return true
    })
}
