import type { CampaignListFilters } from "@/modules/campaigns/types/list"
import type { CampaignStatusKey } from "@/modules/campaigns/lib/campaignStatus"
import { CAMPAIGN_STATUS_KEYS } from "@/modules/campaigns/lib/campaignStatus"
import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const SEARCH_DEBOUNCE_MS = 300
const MAX_SEARCH_LENGTH = 100

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

function parseDistrict(raw: unknown): string | undefined {
    if (typeof raw !== "string" || raw === "") return undefined
    return raw
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
        district: parseDistrict(query.district),
    }
}

export function useCampaignsListFilters(onFiltersChange: () => void) {
    const route = useRoute()
    const router = useRouter()

    const search = ref("")
    const statuses = ref<CampaignStatusKey[]>([])
    const district = ref("")

    let skipRouteWatch = false
    let skipFilterWatch = false

    function syncFromRoute() {
        skipFilterWatch = true
        const parsed = readCampaignListFiltersFromQuery(route.query as Record<string, unknown>)
        search.value = parsed.q ?? ""
        statuses.value = parsed.status ?? []
        district.value = parsed.district ?? ""
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

    const filters = computed<CampaignListFilters>(() => {
        const result: CampaignListFilters = {}
        const q = search.value.trim()
        if (q) result.q = q
        if (statuses.value.length > 0) result.status = [...statuses.value]
        if (district.value) result.district = district.value
        return result
    })

    const hasActiveFilters = computed(
        () => search.value.trim() !== "" || statuses.value.length > 0 || district.value !== "",
    )

    async function clearAllFilters() {
        skipFilterWatch = true
        search.value = ""
        statuses.value = []
        district.value = ""
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
        setOrDelete("q", search.value.trim())
        if (statuses.value.length > 0) {
            nextQuery.status = [...statuses.value]
        } else {
            delete nextQuery.status
        }
        setOrDelete("district", district.value)
        delete nextQuery.page
        skipRouteWatch = true
        await router.replace({ query: nextQuery })
        skipRouteWatch = false
        onFiltersChange()
    }

    watch([statuses, district], () => {
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
        district,
        filters,
        hasActiveFilters,
        clearAllFilters,
    }
}
