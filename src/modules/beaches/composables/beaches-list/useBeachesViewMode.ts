import { fetchBeachesPage } from "@/modules/beaches/services/beaches/fetchBeachesPage"
import type { BeachListItem } from "@/modules/beaches/types/list"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

export type BeachesViewMode = "list" | "map"

const MAP_PAGE_SIZE = 100

// Composable que gere a lógica de beaches vista modo.
export function useBeachesViewMode() {
    const route = useRoute()
    const router = useRouter()

    const viewMode = computed<BeachesViewMode>(() =>
        route.query.view === "map" ? "map" : "list",
    )

    const mapBeaches = ref<BeachListItem[]>([])
    const mapLoading = ref(false)
    const mapError = ref(false)

// Carrega mapa beaches.
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

// Define vista modo.
    async function setViewMode(next: BeachesViewMode) {
        const nextQuery = { ...route.query }
        if (next === "map") {
            nextQuery.view = "map"
        } else {
            delete nextQuery.view
        }
        await router.replace({ query: nextQuery })
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
        setViewMode,
        reloadMap: loadMapBeaches,
    }
}
