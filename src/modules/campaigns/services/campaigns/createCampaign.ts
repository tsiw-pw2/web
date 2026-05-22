import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { requestApiData } from "@/infrastructure/request"

export async function createCampaign(draft: CampaignCreateDraft): Promise<CampaignListItem> {
    return requestApiData<CampaignListItem>("/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: draft.title.trim(),
            meetingTime: draft.meetingTime,
            startDate: draft.startDate,
            endDate: draft.endDate,
            status: draft.status,
            information: draft.information,
            district: draft.district?.trim() ?? "",
            beachIds: draft.beachIds ?? [],
        }),
    })
}
