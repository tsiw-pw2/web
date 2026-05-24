import { inject } from "vue"
import { campaignDetailsPageKey, type CampaignDetailsPageContext } from "@/modules/campaigns/composables/campaign-details/campaignDetailsPageContext"

export function useCampaignDetailsPageInject(): CampaignDetailsPageContext {
    const ctx = inject(campaignDetailsPageKey)
    if (!ctx) {
        throw new Error("CampaignDetailsPage: contexto em falta. Usa provide(campaignDetailsPageKey) na página.")
    }
    return ctx
}
