import { inject } from "vue"
import {
    settingsProfilePageKey,
    type SettingsProfilePageContext,
} from "@/modules/settings/composables/settings-profile/settingsProfilePageContext"

export function useSettingsProfilePageInject(): SettingsProfilePageContext {
    const ctx = inject(settingsProfilePageKey)
    if (!ctx) {
        throw new Error("useSettingsProfilePageInject must be used inside SettingsProfilePage")
    }
    return ctx
}
