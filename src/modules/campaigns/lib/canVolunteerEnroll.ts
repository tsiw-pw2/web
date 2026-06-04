import { ENROLLABLE_CAMPAIGN_STATUS_KEYS } from "@/modules/campaigns/lib/campaignStatus"
import type { CampaignDetails, CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { userMeetsMinimumAge } from "@/shared/lib/birthDate"

// Indica se existe eligible nascimento data.
function hasEligibleBirthDate(profile: SettingsProfile): boolean {
    const birthDate = profile.birthDate?.trim() ?? ""
    if (!birthDate) return false
    return userMeetsMinimumAge(birthDate)
}

// Verifica se é possível voluntário enroll.
export function canVolunteerEnroll(
    campaign: CampaignDetails,
    profile: SettingsProfile | null,
    myRegistration: CampaignDetailsRegistration | null | undefined,
): boolean {
    if (!profile) return false
    if (campaign.organizer?.id === profile.id) return false
    if (profile.isBlocked) return false
    if (!hasEligibleBirthDate(profile)) return false
    if (!ENROLLABLE_CAMPAIGN_STATUS_KEYS.has(campaign.editStatus)) return false
    if (!myRegistration) return true
    return myRegistration.status === 2
}

// Indica se existe activas inscrição.
export function hasActiveRegistration(
    myRegistration: CampaignDetailsRegistration | null | undefined,
): boolean {
    return myRegistration != null && myRegistration.status !== 2
}
