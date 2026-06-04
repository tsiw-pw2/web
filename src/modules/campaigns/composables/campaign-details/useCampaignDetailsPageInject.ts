import { inject } from "vue"
import { campaignDetailsPageKey, type CampaignDetailsPageContext } from "@/modules/campaigns/composables/campaign-details/campaignDetailsPageContext"

// Composable que gere a lógica de campanha detalhes página injecção.
export function useCampaignDetailsPageInject(): CampaignDetailsPageContext {
    const ctx = inject(campaignDetailsPageKey)
    if (!ctx) {
        throw new Error("CampaignDetailsPage: contexto em falta. Usa provide(campaignDetailsPageKey) na página.")
    }
    return ctx
}
