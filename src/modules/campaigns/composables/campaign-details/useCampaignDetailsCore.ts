import { computed, onMounted, ref, watch, type Ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
    type CampaignDetailsTabId,
    DEFAULT_CAMPAIGN_DETAILS_TAB,
    isCampaignDetailsTabId,
} from "@/modules/campaigns/lib/campaignDetailsTabs"
import { visibleCampaignDetailsTabs } from "@/modules/campaigns/lib/campaignDetailsTabConfig"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"

export function useCampaignDetailsCore(
    activeTab: Ref<CampaignDetailsTabId>,
    canManageRegistrations: Ref<boolean>,
    onCampaignLoaded: (campaign: CampaignDetails) => void,
    onCampaignIdChange: () => void,
) {
    const router = useRouter()
    const route = useRoute()

    const loading = ref(true)
    const error = ref(false)
    const campaign = ref<CampaignDetails | null>(null)
    const profile = ref<SettingsProfile | null>(null)

    const campaignId = computed(() => String(route.params.campaignId ?? ""))

    const visibleTabs = computed(() => visibleCampaignDetailsTabs(canManageRegistrations.value))

    function tabRoute(tab: CampaignDetailsTabId) {
        return { name: "campaign-details" as const, params: { campaignId: campaignId.value, tab } }
    }

    function goBack() {
        router.push({ name: "campaigns" })
    }

    async function load() {
        loading.value = true
        error.value = false
        try {
            const data = await getCampaignDetails(campaignId.value)
            campaign.value = data
            onCampaignLoaded(data)
        } catch {
            error.value = true
        } finally {
            loading.value = false
        }
    }

    async function refreshCampaignMetrics() {
        if (!campaignId.value) return
        try {
            const d = await getCampaignDetails(campaignId.value)
            if (campaign.value) {
                campaign.value.metrics = d.metrics
                campaign.value.viewerCanPostComment = d.viewerCanPostComment
                campaign.value.viewerRegistration = d.viewerRegistration
            }
            onCampaignLoaded(d)
        } catch {
            /* ignore */
        }
    }

    onMounted(async () => {
        try {
            profile.value = await fetchProfile()
        } catch {
            profile.value = null
        }
        await load()
    })

    watch(
        () => route.params.tab,
        (tab) => {
            const raw = Array.isArray(tab) ? tab[0] : tab
            if (raw && !isCampaignDetailsTabId(raw)) {
                router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
            }
        },
        { immediate: true },
    )

    watch(
        [activeTab, canManageRegistrations],
        ([tab, canManage]) => {
            if (tab === "voluntarios" && !canManage) {
                router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
            }
        },
    )

    watch(campaignId, (next, prev) => {
        if (!next || next === prev) return
        onCampaignIdChange()
        router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
        void load()
    })

    return {
        loading,
        error,
        campaign,
        profile,
        campaignId,
        visibleTabs,
        tabRoute,
        goBack,
        load,
        refreshCampaignMetrics,
    }
}
