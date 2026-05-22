import type { InjectionKey, Ref } from "vue"
import type { SettingsProfile } from "@/modules/settings/types/profile"

export const settingsProfileKey: InjectionKey<Ref<SettingsProfile | null>> = Symbol("settingsProfile")
