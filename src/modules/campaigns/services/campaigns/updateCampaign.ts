import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function updateCampaign(id: string, draft: CampaignCreateDraft): Promise<CampaignListItem> {
    return requestApiData<CampaignListItem>(`/campaigns/${id}`, {
        method: "PATCH",
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
}
