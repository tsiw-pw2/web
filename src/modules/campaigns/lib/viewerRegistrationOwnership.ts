import type { CampaignDetailsViewerRegistration } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"

// Inscrição do snapshot da campanha pertence ao perfil autenticado.
export function viewerRegistrationBelongsToProfile(
    registration: CampaignDetailsViewerRegistration | null | undefined,
    profile: Pick<SettingsProfile, "id"> | null | undefined,
): boolean {
    if (!registration || !profile?.id) return false
    return registration.userId === profile.id
}
