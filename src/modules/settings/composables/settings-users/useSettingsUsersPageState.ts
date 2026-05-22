import { inject, onMounted } from "vue"
import { useSettingsUsers } from "@/modules/settings/composables/settings-users/useSettingsUsers"
import { useSettingsUsersModals } from "@/modules/settings/composables/settings-users/useSettingsUsersModals"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"

export function useSettingsUsersPageState() {
    const profile = inject(settingsProfileKey)
    const usersApi = useSettingsUsers()
    const modals = useSettingsUsersModals(usersApi.users)

    onMounted(() => {
        if (profile?.value?.isAdmin) {
            void usersApi.reload()
        }
    })

    async function onBlockConfirm(reason: string) {
        if (!modals.actionUserId.value) return
        await usersApi.blockUser(modals.actionUserId.value, reason)
        modals.clearActionUser()
    }

    async function onUnblockConfirm() {
        if (!modals.actionUserId.value) return
        await usersApi.unblockUser(modals.actionUserId.value)
        modals.clearActionUser()
    }

    return {
        profile,
        ...usersApi,
        ...modals,
        onBlockConfirm,
        onUnblockConfirm,
    }
}
