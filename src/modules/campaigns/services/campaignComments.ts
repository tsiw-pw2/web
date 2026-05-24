import { requestApiData } from "@/infrastructure/request"

export async function postCampaignComment(campaignId: string, body: string): Promise<void> {
    await requestApiData(`/campaigns/${campaignId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
    })
}

export async function patchCampaignCommentVisibility(
    campaignId: string,
    commentId: string,
    isVisible: boolean,
): Promise<void> {
    await requestApiData(`/campaigns/${campaignId}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
    })
}
