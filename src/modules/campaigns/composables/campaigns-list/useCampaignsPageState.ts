import { campaignsListRef, campaignsPage, campaignsPageSize, campaignsTotal, loadCampaignsList, setCampaignsListFilters } from "@/modules/campaigns/composables/campaigns-list/campaignsListState"
import { useCampaignsListFilters } from "@/modules/campaigns/composables/campaigns-list/useCampaignsListFilters"
import { useCampaignsListMutations } from "@/modules/campaigns/composables/campaigns-list/useCampaignsListMutations"
import { useCampaignsPageModals } from "@/modules/campaigns/composables/campaigns-list/useCampaignsPageModals"
import { beachesListRef, loadBeachesList } from "@/modules/beaches/services/beachesList"
import { districtSelectOptionsForBeaches } from "@/modules/beaches/lib/districtSelectOptionsForBeaches"
import { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"
import { computed, onMounted, watch } from "vue"

export type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"

// Composable que gere a lógica de campanhas página estado.
export function useCampaignsPageState() {
    const routeApi = usePaginatedListRoute({
        page: campaignsPage,
        pageSize: campaignsPageSize,
        total: campaignsTotal,
        fetchPage: loadCampaignsList,
    })

    const listFilters = useCampaignsListFilters(() => {
        campaignsPage.value = 1
        setCampaignsListFilters(listFilters.filters.value)
        void routeApi.reload()
    })

    setCampaignsListFilters(listFilters.filters.value)

    watch(
        listFilters.filters,
        (next) => {
            setCampaignsListFilters(next)
        },
        { deep: true },
    )

    const mutations = useCampaignsListMutations(routeApi)
    const modals = useCampaignsPageModals()

    const districtOptions = computed(() => districtSelectOptionsForBeaches(beachesListRef.value))

    onMounted(() => {
        void loadBeachesList({ page: 1, pageSize: 100 })
    })

    watch(districtOptions, (options) => {
        const selected = listFilters.district.value
        if (!selected) return
        if (options.some((option) => option.value === selected)) return
        listFilters.district.value = ""
        void listFilters.pushFiltersToRoute()
    })

    return {
        ...routeApi,
        campaigns: campaignsListRef,
        page: campaignsPage,
        pageSize: campaignsPageSize,
        total: campaignsTotal,
        removeCampaign: mutations.removeCampaign,
        addCampaign: mutations.addCampaign,
        updateCampaign: mutations.updateCampaign,
        createCampaignWithToast: mutations.createCampaignWithToast,
        saveCampaignWithToast: mutations.saveCampaignWithToast,
        listFilters,
        districtOptions,
        ...modals,
    }
}
