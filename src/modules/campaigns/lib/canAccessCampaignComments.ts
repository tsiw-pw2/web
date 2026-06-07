import { getLink } from "@/infrastructure/hypermediaClient"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"

// Indica se o visitante pode aceder à listagem de comentários da campanha.
export function canAccessCampaignComments(campaign: CampaignLinkParent | null | undefined): boolean {
    if (!campaign) return false
    return Boolean(getLink(campaign, "comments"))
}
