import { fetchBeachesPage } from "@/modules/beaches/services/beaches/fetchBeachesPage"
import type { BeachListItem } from "@/modules/beaches/types/list"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

export type BeachesViewMode = "list" | "map"

const MAP_PAGE_SIZE = 100

export function useBeachesViewMode() {
    const route = useRoute()
    const router = useRouter()

    const viewMode = computed<BeachesViewMode>(() =>
        route.query.view === "map" ? "map" : "list",
    )

    const mapBeaches = ref<BeachListItem[]>([])
    const mapLoading = ref(false)
    const mapError = ref(false)
    const focusBeachId = ref<string | undefined>()

    async function loadMapBeaches() {
        mapLoading.value = true
        mapError.value = false
        try {
            const data = await fetchBeachesPage(1, MAP_PAGE_SIZE)
            mapBeaches.value = data.items
        } catch {
            mapBeaches.value = []
            mapError.value = true
        } finally {
            mapLoading.value = false
        }
    }

    async function setViewMode(next: BeachesViewMode) {
        const nextQuery = { ...route.query }
        if (next === "map") {
            nextQuery.view = "map"
        } else {
            delete nextQuery.view
        }
        delete nextQuery.q
        await router.replace({ query: nextQuery })
    }

    function focusBeachOnMap(beachId: string | undefined) {
        focusBeachId.value = beachId
    }

    watch(
        viewMode,
        (mode) => {
            if (mode === "map") {
                void loadMapBeaches()
            }
        },
        { immediate: true },
    )

    return {
        viewMode,
        mapBeaches,
        mapLoading,
        mapError,
        focusBeachId,
        focusBeachOnMap,
        setViewMode,
        reloadMap: loadMapBeaches,
    }
}
