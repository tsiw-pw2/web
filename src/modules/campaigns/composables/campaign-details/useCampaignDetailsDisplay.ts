import { computed, type Ref } from "vue"
import { canDeleteWasteCollection } from "@/modules/campaigns/lib/canDeleteWasteCollection"
import { canRecordWasteCollection } from "@/modules/campaigns/lib/canRecordWasteCollection"
import type { CampaignDetailsWasteCollection } from "@/modules/campaigns/types/details"
import { campaignDescriptionText, campaignDistrictLabel, campaignPeriodLabel, campaignPhaseLabel, campaignStatusUi } from "@/modules/campaigns/lib/campaignDetailsDisplay"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { formatWeightKg } from "@/shared/lib/formatPt"

// Composable que gere a lógica de campanha detalhes apresentação.
export function useCampaignDetailsDisplay(
    campaign: Ref<CampaignDetails | null>,
    profile: Ref<SettingsProfile | null>,
) {
    const statusUi = computed(() => campaignStatusUi(campaign.value))

    const descriptionText = computed(() => campaignDescriptionText(campaign.value))

    const campaignPhaseLabelValue = computed(() => campaignPhaseLabel(campaign.value))

    const campaignDistrictLabelValue = computed(() => campaignDistrictLabel(campaign.value))

    const campaignPeriodLabelValue = computed(() => campaignPeriodLabel(campaign.value))

    const canPostComment = computed(() => Boolean(campaign.value?.viewerCanPostComment))

    const canRecordWaste = computed(() => canRecordWasteCollection(campaign.value, profile.value))

// Verifica se é possível eliminação resíduos row.
    function canDeleteWasteRow(row: CampaignDetailsWasteCollection) {
        return canDeleteWasteCollection(campaign.value, profile.value, row)
    }

    return {
        statusUi,
        descriptionText,
        campaignPhaseLabel: campaignPhaseLabelValue,
        campaignDistrictLabel: campaignDistrictLabelValue,
        campaignPeriodLabel: campaignPeriodLabelValue,
        canPostComment,
        canRecordWaste,
        canDeleteWasteRow,
        formatWeightKg,
    }
}
