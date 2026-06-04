import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { href } from "@/infrastructure/apiDiscovery"
import { apiPost } from "@/infrastructure/apiClient"

// Cria uma nova campanha com os dados do rascunho.
export async function createCampaign(draft: CampaignCreateDraft): Promise<CampaignListItem> {
    const path = await href("campaigns")
    return apiPost<CampaignListItem>(path, {
        title: draft.title.trim(),
        meetingTime: draft.meetingTime,
        startDate: draft.startDate,
        endDate: draft.endDate,
        status: draft.status,
        information: draft.information,
        district: draft.district?.trim() ?? "",
        beachIds: draft.beachIds ?? [],
    })
}
