import {
    beachesListRef,
    beachesPage,
    beachesPageSize,
    beachesTotal,
    loadBeachesList,
} from "@/modules/beaches/composables/beaches-list/beachesListState"
import { useBeachesListMutations } from "@/modules/beaches/composables/beaches-list/useBeachesListMutations"
import { useBeachesPageModals } from "@/modules/beaches/composables/beaches-list/useBeachesPageModals"
import { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

export type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"

export function useBeachesPageState() {
    const routeApi = usePaginatedListRoute({
        page: beachesPage,
        pageSize: beachesPageSize,
        total: beachesTotal,
        fetchPage: loadBeachesList,
    })
    const mutations = useBeachesListMutations(routeApi)
    const modals = useBeachesPageModals()

    return {
        ...routeApi,
        beaches: beachesListRef,
        page: beachesPage,
        pageSize: beachesPageSize,
        total: beachesTotal,
        ...mutations,
        ...modals,
    }
}
