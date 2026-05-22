import type { InjectionKey } from "vue"
import type { useSettingsProfileForm } from "@/modules/settings/composables/settings-profile/useSettingsProfileForm"
import type { useSettingsProfileSave } from "@/modules/settings/composables/settings-profile/useSettingsProfileSave"

export type SettingsProfilePageContext = ReturnType<typeof useSettingsProfileForm> &
    ReturnType<typeof useSettingsProfileSave>

export const settingsProfilePageKey: InjectionKey<SettingsProfilePageContext> = Symbol("settingsProfilePage")
