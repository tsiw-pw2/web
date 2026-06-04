import { inject, provide } from "vue"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import { settingsProfilePageKey } from "@/modules/settings/composables/settings-profile/settingsProfilePageContext"
import { useSettingsProfileForm } from "@/modules/settings/composables/settings-profile/useSettingsProfileForm"
import { useSettingsProfileSave } from "@/modules/settings/composables/settings-profile/useSettingsProfileSave"

// Composable que gere a lógica de definições perfil página estado.
export function useSettingsProfilePageState() {
    const profile = inject(settingsProfileKey)
    const form = useSettingsProfileForm(profile)
    const save = useSettingsProfileSave(profile, form)

    const ctx = {
        ...form,
        ...save,
    }

    provide(settingsProfilePageKey, ctx)

    return ctx
}
