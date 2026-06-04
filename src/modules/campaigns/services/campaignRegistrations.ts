import { followHref, followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type PatchRegistrationBody = {
    role?: number
    status?: number
    attendance?: boolean | null
}

type RegistrationResource = CampaignDetailsRegistration & { links?: ResourceLinks }

// Cria uma inscrição numa campanha.
export async function createCampaignRegistration(
    campaign: CampaignLinkParent,
): Promise<CampaignDetailsRegistration> {
    const link = getLink(campaign, "registrations")
    if (link?.href) {
        return followHref<RegistrationResource>(link, { method: "POST" })
    }
    return followHref<RegistrationResource>(
        { href: `/campaigns/${campaign.id}/registrations`, method: "POST" },
        { method: "POST" },
    )
}

// Actualiza dados de uma inscrição existente.
export async function patchRegistration(
    registration: RegistrationResource,
    body: PatchRegistrationBody,
): Promise<CampaignDetailsRegistration> {
    if (getLink(registration, "update")) {
        return followLink(registration, "update", { method: "PATCH", body })
    }
    throw new Error("Registration update link not available")
}

// Elimina uma inscrição de uma campanha.
export async function deleteRegistration(registration: RegistrationResource): Promise<void> {
    if (getLink(registration, "delete")) {
        await followLink(registration, "delete", { method: "DELETE" })
        return
    }
    throw new Error("Registration delete link not available")
}
