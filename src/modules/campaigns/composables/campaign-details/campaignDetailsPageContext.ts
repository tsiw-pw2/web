import type { InjectionKey } from "vue"
import type { useCampaignDetailsPageState } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageState"

export type CampaignDetailsPageContext = ReturnType<typeof useCampaignDetailsPageState>

export const campaignDetailsPageKey: InjectionKey<CampaignDetailsPageContext> = Symbol("campaignDetailsPage")
