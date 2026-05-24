import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

export async function createCampaign(draft: CampaignCreateDraft): Promise<CampaignListItem> {
    const body = await requestApiData<unknown>("/campaigns", {
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
    return unwrapResource<CampaignListItem>(body)
}
