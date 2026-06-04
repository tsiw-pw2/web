import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { profileIsAdmin } from "@/modules/auth/lib/profileCapabilities"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// Verifica se é possível registo resíduos recolha.
export function canRecordWasteCollection(
    campaign: CampaignDetails | null,
    profile: SettingsProfile | null,
): boolean {
    if (!campaign || !profile || profile.isBlocked) return false
    if (profileIsAdmin(profile)) return true
    if (campaign.organizer?.id === profile.id) return true
    const reg = campaign.viewerRegistration
    return reg != null && reg.status === 1
}
