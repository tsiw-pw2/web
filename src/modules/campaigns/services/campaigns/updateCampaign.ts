import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { unwrapResource } from "@/infrastructure/hateoas"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function updateCampaign(id: string, draft: CampaignCreateDraft): Promise<CampaignListItem> {
    const body = await requestApiData<unknown>(`/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            title: draft.title,
            meetingTime: draft.meetingTime,
            startDate: draft.startDate,
            endDate: draft.endDate,
            status: draft.status,
            information: draft.information,
            district: draft.district,
        }),
    })
    return unwrapResource<CampaignListItem>(body)
}
