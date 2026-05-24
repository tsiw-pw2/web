import type { WasteListFilters, WasteUnitKey } from "@/modules/waste/types/list"
import { isWasteUnitKey, WASTE_UNIT_KEYS } from "@/modules/waste/lib/wasteUnitFilter"
import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const SEARCH_DEBOUNCE_MS = 300
const MAX_SEARCH_LENGTH = 100

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

function parseCategory(raw: unknown): string | undefined {
    if (typeof raw !== "string" || raw === "") return undefined
    return raw
}

function parseSearch(raw: unknown): string {
    if (typeof raw !== "string" || raw === "") return ""
    return raw.trim().slice(0, MAX_SEARCH_LENGTH)
}

export function readWasteListFiltersFromQuery(query: Record<string, unknown>): WasteListFilters {
    const units = parseUnits(query.unit)
    return {
        q: parseSearch(query.q) || undefined,
        category: parseCategory(query.category),
        unit: units.length > 0 ? units : undefined,
    }
}

export function useWasteListFilters(onFiltersChange: () => void) {
    const route = useRoute()
    const router = useRouter()

    const search = ref("")
    const units = ref<WasteUnitKey[]>([])
    const category = ref("")

    let skipRouteWatch = false
    let skipFilterWatch = false

    function syncFromRoute() {
        skipFilterWatch = true
        const parsed = readWasteListFiltersFromQuery(route.query as Record<string, unknown>)
        search.value = parsed.q ?? ""
        units.value = parsed.unit ?? []
        category.value = parsed.category ?? ""
        skipFilterWatch = false
    }

    syncFromRoute()

    watch(
        () => route.query,
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
        if (category.value) result.category = category.value
        return result
    })

    const hasActiveFilters = computed(
        () => search.value.trim() !== "" || units.value.length > 0 || category.value !== "",
    )

    async function clearAllFilters() {
        skipFilterWatch = true
        search.value = ""
        units.value = []
        category.value = ""
        skipFilterWatch = false
        await pushFiltersToRoute()
    }

    async function pushFiltersToRoute() {
        const nextQuery: Record<string, string | string[] | undefined> = {
            ...(route.query as Record<string, string | string[] | undefined>),
        }
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
        setOrDelete("category", category.value)
        delete nextQuery.page
        skipRouteWatch = true
        await router.replace({ query: nextQuery })
        skipRouteWatch = false
        onFiltersChange()
    }

    watch([units, category], () => {
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
        category,
        filters,
        hasActiveFilters,
        clearAllFilters,
    }
}
