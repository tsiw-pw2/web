import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { profileIsAdmin } from "@/modules/auth/lib/profileCapabilities"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// Verifica se é possível registar recolha (só organizador da campanha ou admin).
export function canRecordWasteCollection(
    campaign: CampaignDetails | null,
    profile: SettingsProfile | null,
): boolean {
    if (!campaign || !profile || profile.isBlocked) return false
    if (profileIsAdmin(profile)) return true
    return campaign.organizer?.id === profile.id
}
