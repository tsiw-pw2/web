import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { href } from "@/infrastructure/apiDiscovery"
import { apiPatch } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type CampaignResource = CampaignListItem & { links?: ResourceLinks }

// Actualiza uma campanha existente com os dados do rascunho.
export async function updateCampaign(
    idOrResource: string | CampaignResource,
    draft: CampaignCreateDraft,
): Promise<CampaignListItem> {
    const resource =
        typeof idOrResource === "string" ? await getCampaignDetails(idOrResource) : idOrResource
    const body = {
        title: draft.title,
        meetingTime: draft.meetingTime,
        startDate: draft.startDate,
        endDate: draft.endDate,
        status: draft.status,
        information: draft.information,
        district: draft.district,
    }
    if (getLink(resource, "update")) {
        return followLink<CampaignListItem>(resource, "update", { method: "PATCH", body })
    }
    const base = await href("campaigns")
    return apiPatch<CampaignListItem>(`${base}/${resource.id}`, body)
}
