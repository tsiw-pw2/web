import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { computed, onMounted, ref, watch, type Ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type CampaignDetailsTabId, DEFAULT_CAMPAIGN_DETAILS_TAB, isCampaignDetailsTabId } from "@/modules/campaigns/lib/campaignDetailsTabs"
import { canAccessCampaignComments } from "@/modules/campaigns/lib/canAccessCampaignComments"
import { visibleCampaignDetailsTabs } from "@/modules/campaigns/lib/campaignDetailsTabConfig"
import { mergeCampaignEnrollmentSnapshot } from "@/modules/campaigns/lib/mergeCampaignEnrollmentSnapshot"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import type { CampaignDetails } from "@/modules/campaigns/types/details"

// Composable que gere a lógica de campanha detalhes núcleo.
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
    const { profile, loadProfile } = useCurrentProfile()

    const campaignId = computed(() => String(route.params.campaignId ?? ""))

    const visibleTabs = computed(() =>
        visibleCampaignDetailsTabs(canManageRegistrations.value, campaign.value),
    )

// Gera rota dos detalhes da campanha para um separador.
    function tabRoute(tab: CampaignDetailsTabId) {
        return { name: "campaign-details" as const, params: { campaignId: campaignId.value, tab } }
    }

// Navega volta.
    function goBack() {
        router.push({ name: "campaigns" })
    }

// Carrega .
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

// Actualiza métricas, permissão de comentário e inscrição do visualizador via API.
    async function refreshCampaignMetrics() {
        if (!campaignId.value) return
        try {
            const d = await getCampaignDetails(campaignId.value)
            if (campaign.value) {
                mergeCampaignEnrollmentSnapshot(campaign.value, d)
            }
            onCampaignLoaded(d)
        } catch {
            /* ignore */
        }
    }

    onMounted(async () => {
        await loadProfile()
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
        [activeTab, canManageRegistrations, campaign],
        ([tab, canManage, c]) => {
            if (tab === "voluntarios" && !canManage) {
                router.replace(tabRoute(DEFAULT_CAMPAIGN_DETAILS_TAB))
            }
            if (tab === "comentarios" && !canAccessCampaignComments(c)) {
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
