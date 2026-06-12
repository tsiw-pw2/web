import { computed, watch } from "vue"
import { tryRestoreSession } from "@/infrastructure/authSession"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { wasteItemsListRef, wastePage, wastePageSize, wasteTotal, loadWasteItemsList, setWasteListFilters, } from "@/modules/waste/composables/waste-list/wasteListState"
import { useWasteListFilters } from "@/modules/waste/composables/waste-list/useWasteListFilters"
import { useWasteCategoryOptions } from "@/modules/waste/composables/useWasteCategoryOptions"
import { useWasteListMutations } from "@/modules/waste/composables/waste-list/useWasteListMutations"
import { useWastePageModals } from "@/modules/waste/composables/waste-list/useWastePageModals"
import { usePaginatedListRoute } from "@/shared/composables/usePaginatedListRoute"

export type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"

// Carrega a listagem após renovar a sessão (papel no JWT alinhado com a BD).
async function loadWastePageWithSession(opts?: { page?: number; pageSize?: number }) {
    await tryRestoreSession()
    await loadWasteItemsList(opts)
}

// Composable que gere a lógica de resíduos página estado.
export function useWastePageState() {
    const routeApi = usePaginatedListRoute({
        page: wastePage,
        pageSize: wastePageSize,
        total: wasteTotal,
        fetchPage: loadWastePageWithSession,
    })

    const listFilters = useWasteListFilters(() => {
        wastePage.value = 1
        setWasteListFilters(listFilters.filters.value)
        void routeApi.reload()
    })

    setWasteListFilters(listFilters.filters.value)

    watch(
        listFilters.filters,
        (next) => {
            setWasteListFilters(next)
        },
        { deep: true },
    )

    const categories = useWasteCategoryOptions()
    const mutations = useWasteListMutations(routeApi)
    const modals = useWastePageModals()
    const { profile, loadProfile } = useCurrentProfile()

    const isAdmin = computed(() => profile.value?.isRoot === true)

    void categories.loadCategories()
    void loadProfile()

    return {
        ...routeApi,
        items: wasteItemsListRef,
        page: wastePage,
        pageSize: wastePageSize,
        total: wasteTotal,
        categoryOptions: categories.categoryOptions,
        categoriesLoading: categories.categoriesLoading,
        categoryCreating: categories.categoryCreating,
        isAdmin,
        createCategory: categories.createCategory,
        reloadCategories: () => categories.loadCategories(true),
        listFilters,
        ...mutations,
        ...modals,
    }
}
