import {
    blockUser as blockUserApi,
    getSettingsUsersListRoleFilter,
    loadSettingsUsers,
    settingsUsersPage,
    settingsUsersPageSize,
    settingsUsersRef,
    settingsUsersTotal,
    unblockUser as unblockUserApi,
} from "@/modules/settings/services/settingsUsers"
import { mergeRouteQueryWithPagination, parsePageFromRouteQuery, parsePageSizeFromRouteQuery, type PaginationQueryKeys } from "@/shared/lib/listRouteQuery"
import { totalPagesFromTotal } from "@/shared/lib/pagination"
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const QUERY_KEYS: PaginationQueryKeys = { page: "usersPage", pageSize: "usersPageSize" }

export function useSettingsUsers() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchUsers(opts?: { page?: number; pageSize?: number }) {
        loading.value = true
        error.value = null
        try {
            await loadSettingsUsers({
                ...(opts ?? {}),
                role: usersRoleFromRouteQuery(),
            })
            await router.replace({
                query: mergeRouteQueryWithPagination(route.query, settingsUsersPage.value, settingsUsersPageSize.value, DEFAULT_PAGE_SIZE, QUERY_KEYS),
            })
        } catch {
            error.value = "Não foi possível carregar os utilizadores."
        } finally {
            loading.value = false
        }
    }

    function usersRoleFromRouteQuery(): string | undefined {
        const raw = route.query.role
        const s = Array.isArray(raw) ? raw[0] : raw
        return s === "volunteer" ? "volunteer" : undefined
    }

    async function reload() {
        const p = parsePageFromRouteQuery(route.query, QUERY_KEYS.page)
        const ps = parsePageSizeFromRouteQuery(route.query, QUERY_KEYS.pageSize, MAX_PAGE_SIZE)
        await fetchUsers({
            page: p,
            pageSize: ps,
        })
    }

    function goToPrevPage() {
        if (settingsUsersPage.value <= 1) return
        void fetchUsers({ page: settingsUsersPage.value - 1 })
    }

    function goToNextPage() {
        const pages = totalPagesFromTotal(settingsUsersTotal.value, settingsUsersPageSize.value)
        if (settingsUsersPage.value >= pages) return
        void fetchUsers({ page: settingsUsersPage.value + 1 })
    }

    watch(
        () => [route.query[QUERY_KEYS.page], route.query[QUERY_KEYS.pageSize], route.query.role],
        async () => {
            const p = parsePageFromRouteQuery(route.query, QUERY_KEYS.page) ?? 1
            const ps = parsePageSizeFromRouteQuery(route.query, QUERY_KEYS.pageSize, MAX_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE
            const role = usersRoleFromRouteQuery()
            if (p === settingsUsersPage.value && ps === settingsUsersPageSize.value && role === getSettingsUsersListRoleFilter()) {
                return
            }
            await fetchUsers({ page: p, pageSize: ps })
        },
    )

    async function syncRouteFromRefs() {
        await router.replace({
            query: mergeRouteQueryWithPagination(route.query, settingsUsersPage.value, settingsUsersPageSize.value, DEFAULT_PAGE_SIZE, QUERY_KEYS),
        })
    }

    async function blockUser(userId: string, reason: string) {
        await blockUserApi(userId, reason)
        await syncRouteFromRefs()
    }

    async function unblockUser(userId: string) {
        await unblockUserApi(userId)
        await syncRouteFromRefs()
    }

    return {
        users: settingsUsersRef,
        page: settingsUsersPage,
        pageSize: settingsUsersPageSize,
        total: settingsUsersTotal,
        goToPrevPage,
        goToNextPage,
        loading,
        error,
        reload,
        blockUser,
        unblockUser,
    }
}
