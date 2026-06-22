import { getLink } from "@/infrastructure/hypermediaClient"
import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"

export type CampaignCommentsAccess = CampaignLinkParent & {
    editStatus?: CampaignStatusKey
}

// Indica se o visitante pode aceder à listagem de comentários da campanha.
export function canAccessCampaignComments(campaign: CampaignCommentsAccess | null | undefined): boolean {
    if (!campaign) return false
    if (campaign.editStatus && campaign.editStatus !== "concluida") return false
    return Boolean(getLink(campaign, "comments"))
}
