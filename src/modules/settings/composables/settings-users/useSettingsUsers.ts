import {
    blockUser as blockUserApi,
    loadSettingsUsers,
    resetSettingsUsersListState,
    settingsUsersPage,
    settingsUsersPageSize,
    settingsUsersRef,
    settingsUsersTotal,
    unblockUser as unblockUserApi,
    updateUserOrgAdmin as updateUserOrgAdminApi,
} from "@/modules/settings/services/settingsUsers"
import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/apiClient"
import { computed, ref } from "vue"

export function useSettingsUsers() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const invalidRoleFilter = ref<string | null>(null)

    const hasInvalidRoleFilter = computed(() => invalidRoleFilter.value != null)

    async function fetchUsers() {
        loading.value = true
        error.value = null
        invalidRoleFilter.value = null

        try {
            await loadSettingsUsers()
        } catch (e) {
            const base = describeApiLoadFailure(e, "a equipa")
            error.value =
                isApiRequestError(e) && e.message && e.message !== base
                    ? `${base} (${e.message})`
                    : base
        } finally {
            loading.value = false
        }
    }

    async function reload() {
        await fetchUsers()
    }

    async function clearInvalidRoleFilter() {
        invalidRoleFilter.value = null
        await reload()
    }

    function goToPrevPage() {
        if (settingsUsersPage.value <= 1) return
        settingsUsersPage.value -= 1
    }

    function goToNextPage() {
        const pages = Math.ceil(settingsUsersTotal.value / settingsUsersPageSize.value)
        if (settingsUsersPage.value >= pages) return
        settingsUsersPage.value += 1
    }

    async function blockUser(userId: string, reason: string) {
        await blockUserApi(userId, reason)
    }

    async function unblockUser(userId: string) {
        await unblockUserApi(userId)
    }

    async function updateUserOrgAdmin(userId: string, isOrgAdmin: boolean) {
        await updateUserOrgAdminApi(userId, isOrgAdmin)
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
        updateUserOrgAdmin,
        resetSettingsUsersListState,
    }
}
