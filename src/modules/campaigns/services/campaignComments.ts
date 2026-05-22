import { requestApiData } from "@/infrastructure/request"

export async function postCampaignComment(campaignId: string, body: string): Promise<void> {
    await requestApiData<{ ok?: boolean }>(`/campaigns/${campaignId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
    })
}

export async function patchCampaignCommentVisibility(commentId: string, isVisible: boolean): Promise<void> {
    await requestApiData<{ ok?: boolean }>(`/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
    })
}
