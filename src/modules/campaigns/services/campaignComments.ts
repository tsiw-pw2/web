import { followHref, followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { CampaignLinkParent } from "@/modules/campaigns/services/campaignHypermedia"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type CommentResource = { id: string; links?: ResourceLinks }

// Publica um comentário numa campanha.
export async function postCampaignComment(campaign: CampaignLinkParent, body: string): Promise<void> {
    const link = getLink(campaign, "comments")
    if (link?.href) {
        await followHref(link, { method: "POST", body: { body } })
        return
    }
    await followHref(
        { href: `/campaigns/${campaign.id}/comments`, method: "POST" },
        { method: "POST", body: { body } },
    )
}

// Altera a visibilidade de um comentário de campanha.
export async function patchCampaignCommentVisibility(
    comment: CommentResource,
    isVisible: boolean,
): Promise<void> {
    if (getLink(comment, "update")) {
        await followLink(comment, "update", { method: "PATCH", body: { isVisible } })
        return
    }
    throw new Error("Comment update link not available")
}
