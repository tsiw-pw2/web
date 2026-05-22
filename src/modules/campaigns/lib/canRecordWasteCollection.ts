import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

export function canRecordWasteCollection(
    campaign: CampaignDetails | null,
    profile: SettingsProfile | null,
): boolean {
    if (!campaign || !profile || profile.isBlocked) return false
    if (profile.isAdmin) return true
    if (campaign.organizer?.id === profile.id) return true
    const reg = campaign.viewerRegistration
    return reg != null && reg.status === 1
}
