import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { href } from "@/infrastructure/apiDiscovery"
import { apiDelete } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type CampaignResource = { id: string; links?: ResourceLinks }

// Elimina uma campanha pelo identificador ou recurso com links.
export async function deleteCampaign(idOrResource: string | CampaignResource): Promise<void> {
    const resource =
        typeof idOrResource === "string" ? await getCampaignDetails(idOrResource) : idOrResource
    if (getLink(resource, "delete")) {
        await followLink(resource, "delete", { method: "DELETE" })
        return
    }
    const base = await href("campaigns")
    await apiDelete(`${base}/${resource.id}`)
}
