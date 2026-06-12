import type { CampaignListFilters } from "@/modules/campaigns/types/list"
import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import { CAMPAIGN_STATUS_KEYS } from "@/modules/campaigns/lib/campaignStatus"
import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const SEARCH_DEBOUNCE_MS = 300
const MAX_SEARCH_LENGTH = 100

function sameStringArray(a: readonly string[], b: readonly string[]): boolean {
    return a.length === b.length && a.every((value, index) => value === b[index])
}

function campaignFilterQuerySignature(query: Record<string, unknown>): string {
    const parsed = readCampaignListFiltersFromQuery(query)
    return JSON.stringify({
        q: parsed.q ?? "",
        status: parsed.status ?? [],
    })
}

function parseStatuses(raw: unknown): CampaignStatusKey[] {
    if (raw == null) return []
    const parts = Array.isArray(raw) ? raw : typeof raw === "string" && raw !== "" ? [raw] : []
    const seen = new Set<CampaignStatusKey>()
    for (const item of parts) {
        if (typeof item !== "string" || item === "") continue
        if (!CAMPAIGN_STATUS_KEYS.includes(item as CampaignStatusKey)) continue
        seen.add(item as CampaignStatusKey)
    }
    return [...seen]
}

function parseSearch(raw: unknown): string {
    if (typeof raw !== "string" || raw === "") return ""
    return raw.trim().slice(0, MAX_SEARCH_LENGTH)
}

export function readCampaignListFiltersFromQuery(query: Record<string, unknown>): CampaignListFilters {
    const statuses = parseStatuses(query.status)
    return {
        q: parseSearch(query.q) || undefined,
        status: statuses.length > 0 ? statuses : undefined,
    }
}

export function useCampaignsListFilters(onFiltersChange: () => void) {
    const route = useRoute()
    const router = useRouter()

    const search = ref("")
    const statuses = ref<CampaignStatusKey[]>([])

    let skipRouteWatch = false
    let skipFilterWatch = false

    function syncFromRoute() {
        skipFilterWatch = true
        const parsed = readCampaignListFiltersFromQuery(route.query as Record<string, unknown>)
        const nextSearch = parsed.q ?? ""
        const nextStatuses = parsed.status ?? []

        if (search.value !== nextSearch) search.value = nextSearch
        if (!sameStringArray(statuses.value, nextStatuses)) statuses.value = [...nextStatuses]

        skipFilterWatch = false
    }

    syncFromRoute()

    watch(
        () => campaignFilterQuerySignature(route.query as Record<string, unknown>),
        () => {
            if (skipRouteWatch) return
            syncFromRoute()
        },
    )

    const filters = computed<CampaignListFilters>(() => {
        const result: CampaignListFilters = {}
        const q = search.value.trim()
        if (q) result.q = q
        if (statuses.value.length > 0) result.status = [...statuses.value]
        return result
    })

    const hasActiveFilters = computed(
        () => search.value.trim() !== "" || statuses.value.length > 0,
    )

    async function clearAllFilters() {
        skipFilterWatch = true
        search.value = ""
        statuses.value = []
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
        delete nextQuery.scope
        delete nextQuery.from
        delete nextQuery.to
        delete nextQuery.district
        setOrDelete("q", search.value.trim())
        if (statuses.value.length > 0) {
            nextQuery.status = [...statuses.value]
        } else {
            delete nextQuery.status
        }
        delete nextQuery.page
        skipRouteWatch = true
        await router.replace({ query: nextQuery })
        skipRouteWatch = false
        onFiltersChange()
    }

    watch(statuses, () => {
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
        statuses,
        filters,
        hasActiveFilters,
        clearAllFilters,
        pushFiltersToRoute,
    }
}
