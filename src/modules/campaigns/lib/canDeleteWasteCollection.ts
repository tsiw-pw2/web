import type { CampaignDetails, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import { isCampaignTerminalStatus } from "@/modules/campaigns/lib/campaignStatus"
import { profileIsOrgAdmin } from "@/modules/auth/lib/profileCapabilities"
import { getLink } from "@/infrastructure/hypermediaClient"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// Alinhado com a API: só gestor da campanha (organizador ou admin org) pode apagar recolhas.
export function canDeleteWasteCollection(
    campaign: CampaignDetails | null,
    profile: SettingsProfile | null,
    row: CampaignDetailsWasteCollection,
): boolean {
    if (!campaign || !profile || profile.isBlocked) return false
    if (isCampaignTerminalStatus(campaign.editStatus)) return false

    if (row.links) {
        return Boolean(getLink(row, "delete"))
    }

    if (profileIsOrgAdmin(profile)) return true
    return campaign.organizer?.id === profile.id
}
