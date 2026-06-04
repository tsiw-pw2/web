import { inject, onMounted } from "vue"
import { useSettingsUsers } from "@/modules/settings/composables/settings-users/useSettingsUsers"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"

// Composable que gere a lógica de definições utilizadores página estado.
export function useSettingsUsersPageState() {
    const profile = inject(settingsProfileKey)
    const usersApi = useSettingsUsers()

    onMounted(() => {
        if (profile?.value?.isAdmin) {
            void usersApi.reload()
        }
    })

    return {
        profile,
        ...usersApi,
    }
}
