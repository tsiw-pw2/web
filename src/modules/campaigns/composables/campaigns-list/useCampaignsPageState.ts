import {
    campaignsListRef,
    campaignsPage,
    campaignsPageSize,
    campaignsTotal,
    loadCampaignsList,
} from "@/modules/campaigns/composables/campaigns-list/campaignsListState"
import { useCampaignsListMutations } from "@/modules/campaigns/composables/campaigns-list/useCampaignsListMutations"
import { useCampaignsPageModals } from "@/modules/campaigns/composables/campaigns-list/useCampaignsPageModals"
import { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

export type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"

export function useCampaignsPageState() {
    const routeApi = usePaginatedListRoute({
        page: campaignsPage,
        pageSize: campaignsPageSize,
        total: campaignsTotal,
        fetchPage: loadCampaignsList,
    })
    const mutations = useCampaignsListMutations(routeApi)
    const modals = useCampaignsPageModals()

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
        ...modals,
    }
}
