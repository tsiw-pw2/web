import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import type { SettingsUserDetailsTabId } from "@/modules/settings/lib/settingsUserDetailsTabs"
import { fetchSettingsUserDetail } from "@/modules/settings/services/settingsUserDetails"
import { updateUserOrgAdmin } from "@/modules/settings/services/settingsUsers"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import type { SettingsUserDetail } from "@/modules/settings/types/settingsUserDetails"
import { computed, ref, watch, type Ref } from "vue"

export function useSettingsUserDetails(userId: Ref<string>, _activeTab: Ref<SettingsUserDetailsTabId>) {
    const user = ref<SettingsUserDetail | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)
    const savingRole = ref(false)
    const selectedRole = ref<SettingsUserRoleKey | undefined>(undefined)

    const canSaveRole = computed(() => {
        const u = user.value
        if (!u || savingRole.value || !selectedRole.value) return false
        const nextIsOrgAdmin = selectedRole.value === "orgAdmin"
        const currentIsOrgAdmin = u.role === "orgAdmin" || u.isOrgAdmin === true
        return nextIsOrgAdmin !== currentIsOrgAdmin
    })

    async function loadUser() {
        loading.value = true
        error.value = null
        try {
            const detail = await fetchSettingsUserDetail(userId.value)
            user.value = detail
            selectedRole.value = detail.role
        } catch (e) {
            user.value = null
            error.value = describeApiLoadFailure(e, "o membro da equipa")
        } finally {
            loading.value = false
        }
    }

    async function saveRole(isSelfOrgAdmin: boolean) {
        const u = user.value
        if (!u || !selectedRole.value || !canSaveRole.value) return
        if (isSelfOrgAdmin && selectedRole.value !== "orgAdmin") return
        savingRole.value = true
        try {
            await updateUserOrgAdmin(u.id, selectedRole.value === "orgAdmin")
            await loadUser()
            toastSuccess("Cargo actualizado", "O perfil do membro foi actualizado.")
        } catch (e) {
            toastFromListMutationError(e, { mode: "save" })
        } finally {
            savingRole.value = false
        }
    }

    watch(
        userId,
        async () => {
            await loadUser()
        },
        { immediate: true },
    )

    return {
        user,
        loading,
        error,
        selectedRole,
        savingRole,
        canSaveRole,
        loadUser,
        saveRole,
    }
}
