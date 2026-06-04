import type { WasteListFilters, WasteUnitKey } from "@/modules/waste/types/list"
import { isWasteUnitKey, WASTE_UNIT_KEYS } from "@/modules/waste/lib/wasteUnitFilter"
import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const SEARCH_DEBOUNCE_MS = 300
const MAX_SEARCH_LENGTH = 100

// Compara dois arrays de strings elemento a elemento.
function sameStringArray(a: readonly string[], b: readonly string[]): boolean {
    return a.length === b.length && a.every((value, index) => value === b[index])
}

// Serializa os filtros da listagem de resíduos para detetar alterações na query.
function wasteFilterQuerySignature(query: Record<string, unknown>): string {
    const parsed = readWasteListFiltersFromQuery(query)
    return JSON.stringify({
        q: parsed.q ?? "",
        unit: parsed.unit ?? [],
        categories: parsed.categories ?? [],
    })
}

// Analisa units.
function parseUnits(raw: unknown): WasteUnitKey[] {
    if (raw == null) return []
    const parts = Array.isArray(raw) ? raw : typeof raw === "string" && raw !== "" ? [raw] : []
    const seen = new Set<WasteUnitKey>()
    for (const item of parts) {
        if (typeof item !== "string" || item === "") continue
        const normalized = item === "kg" ? "peso" : item
        if (!isWasteUnitKey(normalized)) continue
        seen.add(normalized)
    }
    return [...seen]
}

// Analisa categorias.
function parseCategories(raw: unknown): string[] {
    if (raw == null) return []
    const parts = Array.isArray(raw) ? raw : typeof raw === "string" && raw !== "" ? [raw] : []
    const seen = new Set<string>()
    for (const item of parts) {
        if (typeof item !== "string" || item === "") continue
        seen.add(item)
    }
    return [...seen]
}

// Analisa pesquisa.
function parseSearch(raw: unknown): string {
    if (typeof raw !== "string" || raw === "") return ""
    return raw.trim().slice(0, MAX_SEARCH_LENGTH)
}

// Lê resíduos lista filtros de consulta.
export function readWasteListFiltersFromQuery(query: Record<string, unknown>): WasteListFilters {
    const units = parseUnits(query.unit)
    const categories = parseCategories(query.category)
    return {
        q: parseSearch(query.q) || undefined,
        categories: categories.length > 0 ? categories : undefined,
        unit: units.length > 0 ? units : undefined,
    }
}

// Composable que gere a lógica de resíduos lista filtros.
export function useWasteListFilters(onFiltersChange: () => void) {
    const route = useRoute()
    const router = useRouter()

    const search = ref("")
    const units = ref<WasteUnitKey[]>([])
    const categories = ref<string[]>([])

    let skipRouteWatch = false
    let skipFilterWatch = false

// Sincroniza de rota.
    function syncFromRoute() {
        skipFilterWatch = true
        const parsed = readWasteListFiltersFromQuery(route.query as Record<string, unknown>)
        const nextSearch = parsed.q ?? ""
        const nextUnits = parsed.unit ?? []
        const nextCategories = parsed.categories ?? []

        if (search.value !== nextSearch) search.value = nextSearch
        if (!sameStringArray(units.value, nextUnits)) units.value = [...nextUnits]
        if (!sameStringArray(categories.value, nextCategories)) categories.value = [...nextCategories]

        skipFilterWatch = false
    }

    syncFromRoute()

    watch(
        () => wasteFilterQuerySignature(route.query as Record<string, unknown>),
        () => {
            if (skipRouteWatch) return
            syncFromRoute()
        },
    )

    const filters = computed<WasteListFilters>(() => {
        const result: WasteListFilters = {}
        const q = search.value.trim()
        if (q) result.q = q
        if (units.value.length > 0) result.unit = [...units.value]
        if (categories.value.length > 0) result.categories = [...categories.value]
        return result
    })

    const hasActiveFilters = computed(
        () => search.value.trim() !== "" || units.value.length > 0 || categories.value.length > 0,
    )

// Limpa pesquisa, unidades e categorias e actualiza a query da rota.
    async function clearAllFilters() {
        skipFilterWatch = true
        search.value = ""
        units.value = []
        categories.value = []
        skipFilterWatch = false
        await pushFiltersToRoute()
    }

// Envia filtros para rota.
    async function pushFiltersToRoute() {
        const nextQuery: Record<string, string | string[] | undefined> = {
            ...(route.query as Record<string, string | string[] | undefined>),
        }

// Define ou eliminação.
        const setOrDelete = (key: string, value: string) => {
            if (value) nextQuery[key] = value
            else delete nextQuery[key]
        }
        setOrDelete("q", search.value.trim())
        if (units.value.length > 0) {
            nextQuery.unit = units.value.filter((u) => WASTE_UNIT_KEYS.includes(u))
        } else {
            delete nextQuery.unit
        }
        if (categories.value.length > 0) {
            nextQuery.category = categories.value
        } else {
            delete nextQuery.category
        }
        delete nextQuery.page
        skipRouteWatch = true
        await router.replace({ query: nextQuery })
        skipRouteWatch = false
        onFiltersChange()
    }

    watch([units, categories], () => {
        if (skipFilterWatch) return
        void pushFiltersToRoute()
    }, { deep: true })

    watchDebounced(
        search,
        () => {
            if (skipFilterWatch) return
            void pushFiltersToRoute()
        },
        { debounce: SEARCH_DEBOUNCE_MS },
    )

    return {
        search,
        units,
        categories,
        filters,
        hasActiveFilters,
        clearAllFilters,
    }
}
