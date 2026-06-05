import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// O botão «Inscrever-me» segue apenas o snapshot da API (viewerCanEnroll) e bloqueio de conta.
export function canSelfEnrollInCampaign(
    campaign: Pick<CampaignDetails, "viewerCanEnroll"> | null | undefined,
    profile: Pick<SettingsProfile, "isBlocked"> | null | undefined,
): boolean {
    if (!campaign || !profile) return false
    if (profile.isBlocked) return false
    return campaign.viewerCanEnroll === true
}
