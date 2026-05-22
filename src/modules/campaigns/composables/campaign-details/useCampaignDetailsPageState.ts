import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useCampaignDetailsComments } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsComments"
import { useCampaignDetailsCore } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsCore"
import { useCampaignDetailsDisplay } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsDisplay"
import { useCampaignDetailsRegistrationRows } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsRegistrationRows"
import { useCampaignDetailsTabs } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsTabs"
import { useCampaignDetailsWaste } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsWaste"
import { useCampaignRegistrationActions } from "@/modules/campaigns/composables/campaign-details/useCampaignRegistrationActions"
import { campaignDetailsTabFromRoute } from "@/modules/campaigns/lib/campaignDetailsTabs"

export function useCampaignDetailsPageState() {
    const route = useRoute()
    const activeTab = computed(() => campaignDetailsTabFromRoute(route.params.tab))
    const canManageRegistrations = ref(false)

    const campaignId = computed(() => String(route.params.campaignId ?? ""))
    const tabs = useCampaignDetailsTabs(campaignId, activeTab)

    const core = useCampaignDetailsCore(
        activeTab,
        canManageRegistrations,
        (data) => {
            registration.syncMyRegistrationFromCampaign(data)
            tabs.syncTabLoad(activeTab.value)
        },
        () => {
            tabs.resetTabState()
        },
    )

    const registration = useCampaignRegistrationActions(
        core.campaignId,
        core.campaign,
        core.profile,
        tabs.reloadRegistrationsFirstPage,
    )

    watch(
        () => registration.canManageRegistrations.value,
        (value) => {
            canManageRegistrations.value = value
        },
        { immediate: true },
    )

    const display = useCampaignDetailsDisplay(core.campaign, core.profile)
    const comments = useCampaignDetailsComments(
        core.campaignId,
        core.profile,
        tabs.reloadCommentsFirstPage,
        core.refreshCampaignMetrics,
    )
    const waste = useCampaignDetailsWaste(
        core.campaignId,
        core.campaign,
        {
            wasteBeachId: tabs.wasteBeachId,
            wasteTotal: tabs.wasteTotal,
            setWasteBeachFilter: tabs.setWasteBeachFilter,
            reloadWasteFirstPage: tabs.reloadWasteFirstPage,
        },
        core.refreshCampaignMetrics,
    )
    const registrationRows = useCampaignDetailsRegistrationRows(
        { registrations: tabs.registrations },
        {
            openEditRegistration: registration.openEditRegistration,
            openDeleteRegistration: registration.openDeleteRegistration,
            myRegistration: registration.myRegistration,
        },
    )

    return {
        activeTab,
        core,
        display,
        tabs,
        registration,
        registrationRows,
        comments,
        waste,
    }
}
