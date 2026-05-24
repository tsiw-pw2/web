import { describeApiFailure } from "@/infrastructure/apiErrors"
import { getAccessToken } from "@/infrastructure/access-token"
import { tryRestoreSession } from "@/infrastructure/authSession"
import { nextTick, onMounted, ref, watch, type Ref } from "vue"
import { isNavigationFailure, useRoute, useRouter } from "vue-router"
import { mergeRouteQueryWithPagination, parsePageFromRouteQuery, parsePageSizeFromRouteQuery, type PaginationQueryKeys } from "@/shared/lib/listRouteQuery"
import { PAGINATED_LIST_DEFAULT_PAGE_SIZE, PAGINATED_LIST_MAX_PAGE_SIZE } from "@/shared/lib/paginatedListDefaults"
import { totalPagesFromTotal } from "@/shared/lib/pagination"

const DEFAULT_QUERY_KEYS: PaginationQueryKeys = { page: "page", pageSize: "pageSize" }

export type UsePaginatedListRouteOptions = {
    page: Ref<number>
    pageSize: Ref<number>
    total: Ref<number>
    fetchPage: (opts?: { page?: number; pageSize?: number }) => Promise<void>
    queryKeys?: PaginationQueryKeys
    defaultPageSize?: number
    maxPageSize?: number
}

export function usePaginatedListRoute(options: UsePaginatedListRouteOptions) {
    const route = useRoute()
    const router = useRouter()

    const loading = ref(false)
    const error = ref(false)
    const errorHint = ref("")

    const queryKeys = options.queryKeys ?? DEFAULT_QUERY_KEYS
    const defaultPageSize = options.defaultPageSize ?? PAGINATED_LIST_DEFAULT_PAGE_SIZE
    const maxPageSize = options.maxPageSize ?? PAGINATED_LIST_MAX_PAGE_SIZE

    let activeLoadId = 0
    let skipRouteWatch = false

    async function syncPaginationQuery() {
        const failure = await router.replace({
            query: mergeRouteQueryWithPagination(
                route.query,
                options.page.value,
                options.pageSize.value,
                defaultPageSize,
                queryKeys,
            ),
        })
        if (failure && !isNavigationFailure(failure)) {
            if (import.meta.env.DEV) {
                console.debug("[usePaginatedListRoute] navigation failure", failure)
            }
        }
    }

    async function load(opts?: { page?: number; pageSize?: number }) {
        const loadId = ++activeLoadId
        loading.value = true
        error.value = false
        errorHint.value = ""
        skipRouteWatch = true
        try {
            await options.fetchPage(opts)
            if (loadId !== activeLoadId) return
            await syncPaginationQuery()
        } catch (e) {
            if (loadId !== activeLoadId) return
            error.value = true
            errorHint.value = describeApiFailure(e, "Verifica a ligação e tenta outra vez.")
        } finally {
            if (loadId === activeLoadId) {
                loading.value = false
            }
            await nextTick()
            skipRouteWatch = false
        }
    }

    async function reload() {
        const p = parsePageFromRouteQuery(route.query, queryKeys.page) ?? options.page.value
        const ps =
            parsePageSizeFromRouteQuery(route.query, queryKeys.pageSize, maxPageSize) ??
            options.pageSize.value
        await load({ page: p, pageSize: ps })
    }

    function goToPrevPage() {
        if (options.page.value <= 1) return
        void load({ page: options.page.value - 1 })
    }

    function goToNextPage() {
        const pages = totalPagesFromTotal(options.total.value, options.pageSize.value)
        if (options.page.value >= pages) return
        void load({ page: options.page.value + 1 })
    }

    async function syncRouteFromRefs() {
        skipRouteWatch = true
        try {
            await syncPaginationQuery()
            await options.fetchPage({
                page: options.page.value,
                pageSize: options.pageSize.value,
            })
        } finally {
            await nextTick()
            skipRouteWatch = false
        }
    }

    watch(
        () => [route.query[queryKeys.page], route.query[queryKeys.pageSize]],
        async () => {
            if (skipRouteWatch) return
            const p = parsePageFromRouteQuery(route.query, queryKeys.page) ?? 1
            const ps =
                parsePageSizeFromRouteQuery(route.query, queryKeys.pageSize, maxPageSize) ??
                defaultPageSize
            if (p === options.page.value && ps === options.pageSize.value) {
                return
            }
            await load({ page: p, pageSize: ps })
        },
    )

    onMounted(async () => {
        if (!getAccessToken()) {
            await tryRestoreSession()
        }
        const p = parsePageFromRouteQuery(route.query, queryKeys.page) ?? 1
        const ps =
            parsePageSizeFromRouteQuery(route.query, queryKeys.pageSize, maxPageSize) ??
            defaultPageSize
        await load({ page: p, pageSize: ps })
    })

    return {
        loading,
        error,
        errorHint,
        reload,
        goToPrevPage,
        goToNextPage,
        syncRouteFromRefs,
    }
}
