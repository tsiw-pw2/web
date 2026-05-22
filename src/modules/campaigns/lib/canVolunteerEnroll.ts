import { ENROLLABLE_CAMPAIGN_STATUS_KEYS } from "@/modules/campaigns/lib/campaignStatus"
import type { CampaignDetails, CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

export function canVolunteerEnroll(
    campaign: CampaignDetails,
    profile: SettingsProfile | null,
    myRegistration: CampaignDetailsRegistration | null | undefined,
): boolean {
    if (!profile) return false
    if (campaign.organizer?.id === profile.id) return false
    if (profile.isBlocked) return false
    if (!ENROLLABLE_CAMPAIGN_STATUS_KEYS.has(campaign.editStatus)) return false
    if (!myRegistration) return true
    return myRegistration.status === 2
}

export function hasActiveRegistration(
    myRegistration: CampaignDetailsRegistration | null | undefined,
): boolean {
    return myRegistration != null && myRegistration.status !== 2
}
