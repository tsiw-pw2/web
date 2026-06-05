import type { CampaignDetailsResource } from "@/modules/campaigns/services/campaignDetails"
import type { CampaignDetails } from "@/modules/campaigns/types/details"

// Actualiza no objeto em memória os campos de inscrição devolvidos pelo GET da campanha.
export function mergeCampaignEnrollmentSnapshot(
    target: CampaignDetails,
    source: CampaignDetailsResource,
): void {
    target.metrics = source.metrics
    target.viewerCanPostComment = source.viewerCanPostComment
    target.viewerCanEnroll = source.viewerCanEnroll
    target.viewerRegistration = source.viewerRegistration
    if (source.links) {
        target.links = source.links
    }
}
