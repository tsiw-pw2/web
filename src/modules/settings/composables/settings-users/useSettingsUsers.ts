import {
    blockUser as blockUserApi,
    getSettingsUsersListRoleFilter,
    loadSettingsUsers,
    resetSettingsUsersListState,
    settingsUsersPage,
    settingsUsersPageSize,
    settingsUsersRef,
    settingsUsersTotal,
    unblockUser as unblockUserApi,
    updateUserRole as updateUserRoleApi,
} from "@/modules/settings/services/settingsUsers"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import { parseUsersListRoleQuery } from "@/modules/settings/lib/settingsUsersListRoleQuery"
import { mergeRouteQueryWithPagination, parsePageFromRouteQuery, parsePageSizeFromRouteQuery, type PaginationQueryKeys } from "@/shared/lib/listRouteQuery"
import type { LocationQuery } from "vue-router"
import { totalPagesFromTotal } from "@/shared/lib/pagination"
import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/apiClient"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const QUERY_KEYS: PaginationQueryKeys = { page: "usersPage", pageSize: "usersPageSize" }

function routeQueryWithoutRole(query: LocationQuery): LocationQuery {
    const next = { ...query }
    delete next.role
    return next
}

export function useSettingsUsers() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const invalidRoleFilter = ref<string | null>(null)

    const hasInvalidRoleFilter = computed(() => invalidRoleFilter.value != null)

    async function fetchUsers(opts?: { page?: number; pageSize?: number }) {
        loading.value = true
        error.value = null

        const roleQuery = parseUsersListRoleQuery(route.query.role)
        if (roleQuery.invalid) {
            invalidRoleFilter.value = roleQuery.raw
            resetSettingsUsersListState()
            loading.value = false
            return
        }

        invalidRoleFilter.value = null

        try {
            await loadSettingsUsers({
                ...(opts ?? {}),
                role: roleQuery.filter,
            })
            await router.replace({
                query: mergeRouteQueryWithPagination(
                    roleQuery.filter != null ? route.query : routeQueryWithoutRole(route.query),
                    settingsUsersPage.value,
                    settingsUsersPageSize.value,
                    DEFAULT_PAGE_SIZE,
                    QUERY_KEYS,
                ),
            })
        } catch (e) {
            const base = describeApiLoadFailure(e, "os utilizadores")
            error.value =
                isApiRequestError(e) && e.message && e.message !== base
                    ? `${base} (${e.message})`
                    : base
        } finally {
            loading.value = false
        }
    }

    async function reload() {
        const p = parsePageFromRouteQuery(route.query, QUERY_KEYS.page) ?? 1
        const ps = parsePageSizeFromRouteQuery(route.query, QUERY_KEYS.pageSize, MAX_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE
        await fetchUsers({
            page: p,
            pageSize: ps,
        })
    }

    async function clearInvalidRoleFilter() {
        const nextQuery = routeQueryWithoutRole(route.query)
        delete nextQuery[QUERY_KEYS.page]
        delete nextQuery[QUERY_KEYS.pageSize]
        await router.replace({ query: nextQuery })
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
            const roleParsed = parseUsersListRoleQuery(route.query.role)
            if (roleParsed.invalid) {
                await fetchUsers({ page: p, pageSize: ps })
                return
            }
            const role = roleParsed.filter
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

    async function updateUserRole(userId: string, role: SettingsUserRoleKey) {
        await updateUserRoleApi(userId, role)
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
        invalidRoleFilter,
        hasInvalidRoleFilter,
        reload,
        clearInvalidRoleFilter,
        blockUser,
        unblockUser,
        updateUserRole,
    }
}
