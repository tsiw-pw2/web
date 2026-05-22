import { onMounted, ref, watch, type Ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
    mergeRouteQueryWithPagination,
    parsePageFromRouteQuery,
    parsePageSizeFromRouteQuery,
    type PaginationQueryKeys,
} from "@/shared/lib/listRouteQuery"
import {
    PAGINATED_LIST_DEFAULT_PAGE_SIZE,
    PAGINATED_LIST_MAX_PAGE_SIZE,
} from "@/shared/lib/paginatedListDefaults"
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

    const queryKeys = options.queryKeys ?? DEFAULT_QUERY_KEYS
    const defaultPageSize = options.defaultPageSize ?? PAGINATED_LIST_DEFAULT_PAGE_SIZE
    const maxPageSize = options.maxPageSize ?? PAGINATED_LIST_MAX_PAGE_SIZE

    async function load(opts?: { page?: number; pageSize?: number }) {
        loading.value = true
        error.value = false
        try {
            await options.fetchPage(opts)
            await router.replace({
                query: mergeRouteQueryWithPagination(
                    route.query,
                    options.page.value,
                    options.pageSize.value,
                    defaultPageSize,
                    queryKeys,
                ),
            })
        } catch {
            error.value = true
        } finally {
            loading.value = false
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
        await router.replace({
            query: mergeRouteQueryWithPagination(
                route.query,
                options.page.value,
                options.pageSize.value,
                defaultPageSize,
                queryKeys,
            ),
        })
        await options.fetchPage({
            page: options.page.value,
            pageSize: options.pageSize.value,
        })
    }

    watch(
        () => [route.query[queryKeys.page], route.query[queryKeys.pageSize]],
        async () => {
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
        const p = parsePageFromRouteQuery(route.query, queryKeys.page) ?? 1
        const ps =
            parsePageSizeFromRouteQuery(route.query, queryKeys.pageSize, maxPageSize) ??
            defaultPageSize
        await load({ page: p, pageSize: ps })
    })

    return {
        loading,
        error,
        reload,
        goToPrevPage,
        goToNextPage,
        syncRouteFromRefs,
    }
}
