import { inject } from "vue"
import { settingsProfilePageKey, type SettingsProfilePageContext } from "@/modules/settings/composables/settings-profile/settingsProfilePageContext"

// Composable que gere a lógica de definições perfil página injecção.
export function useSettingsProfilePageInject(): SettingsProfilePageContext {
    const ctx = inject(settingsProfilePageKey)
    if (!ctx) {
        throw new Error("useSettingsProfilePageInject must be used inside SettingsProfilePage")
    }
    return ctx
}
