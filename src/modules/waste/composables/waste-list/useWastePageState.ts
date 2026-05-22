import {
    wasteItemsListRef,
    wastePage,
    wastePageSize,
    wasteTotal,
    loadWasteItemsList,
} from "@/modules/waste/composables/waste-list/wasteListState"
import { useWasteListMutations } from "@/modules/waste/composables/waste-list/useWasteListMutations"
import { useWastePageModals } from "@/modules/waste/composables/waste-list/useWastePageModals"
import { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

export type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"

export function useWastePageState() {
    const routeApi = usePaginatedListRoute({
        page: wastePage,
        pageSize: wastePageSize,
        total: wasteTotal,
        fetchPage: loadWasteItemsList,
    })
    const mutations = useWasteListMutations(routeApi)
    const modals = useWastePageModals()

    return {
        ...routeApi,
        items: wasteItemsListRef,
        page: wastePage,
        pageSize: wastePageSize,
        total: wasteTotal,
        ...mutations,
        ...modals,
    }
}
