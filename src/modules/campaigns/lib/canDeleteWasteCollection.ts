import type { CampaignDetails, CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// Verifica se é possível eliminação resíduos recolha.
export function canDeleteWasteCollection(
    campaign: CampaignDetails | null,
    profile: SettingsProfile | null,
    row: CampaignDetailsWasteCollection,
): boolean {
    if (!campaign || !profile || profile.isBlocked) return false
    if (profile.isAdmin) return true
    if (campaign.organizer?.id === profile.id) return true
    if (row.recordedBy?.id === profile.id) return true
    const reg = campaign.viewerRegistration
    return reg != null && (reg.status === 0 || reg.status === 1)
}
