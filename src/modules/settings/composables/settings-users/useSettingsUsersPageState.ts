import { inject, onMounted } from "vue"
import { useSettingsUsers } from "@/modules/settings/composables/settings-users/useSettingsUsers"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import { profileIsOrgAdmin } from "@/modules/auth/lib/profileCapabilities"

export function useSettingsUsersPageState() {
    const profile = inject(settingsProfileKey)
    const usersApi = useSettingsUsers()

    onMounted(() => {
        if (profileIsOrgAdmin(profile?.value)) {
            void usersApi.reload()
        }
    })

    return {
        profile,
        ...usersApi,
    }
}
