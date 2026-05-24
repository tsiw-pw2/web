import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { ref, type Ref } from "vue"
import { updateProfileWithOptionalAvatarFile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { describeListMutationFailure, toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isValidAvatarUrlField } from "@/shared/lib/avatarUrl"
import { validateProfileBirthDate } from "@/shared/lib/birthDate"

type SettingsProfileFormSaveSlice = {
    profileName: Ref<string>
    profileEmail: Ref<string>
    profilePhone: Ref<string>
    profileBirthDate: Ref<string>
    profileAvatarUrl: Ref<string>
    pendingAvatarFile: Ref<File | null>
    applyProfileToForm: (p: SettingsProfile, options?: { bumpAvatarCache?: boolean }) => void
}

export function useSettingsProfileSave(
    profile: Ref<SettingsProfile | null | undefined> | undefined,
    form: SettingsProfileFormSaveSlice,
) {
    const { setProfile: setCurrentProfile } = useCurrentProfile()
    const profileSaveError = ref<string | null>(null)
    const savingProfile = ref(false)

    async function saveProfile() {
        profileSaveError.value = null
        if (!form.pendingAvatarFile.value && !isValidAvatarUrlField(form.profileAvatarUrl.value)) {
            profileSaveError.value = "Não foi possível validar a foto. Recarrega a página ou remove a imagem."
            return
        }
        const birthDateError = validateProfileBirthDate(form.profileBirthDate.value)
        if (birthDateError) {
            profileSaveError.value = birthDateError
            toastError(birthDateError)
            return
        }
        savingProfile.value = true
        const hadAvatarUpload = form.pendingAvatarFile.value !== null
        try {
            const updated = await updateProfileWithOptionalAvatarFile({
                name: form.profileName.value,
                email: form.profileEmail.value,
                phone: form.profilePhone.value,
                birthDate: form.profileBirthDate.value,
                avatarUrl: form.pendingAvatarFile.value !== null ? "" : form.profileAvatarUrl.value.trim(),
                avatarFile: form.pendingAvatarFile.value,
            })
            const avatarCacheBust = hadAvatarUpload ? Date.now() : undefined
            if (profile) profile.value = updated
            setCurrentProfile(updated, { avatarCacheBust })
            form.applyProfileToForm(updated, { bumpAvatarCache: hadAvatarUpload })
            toastSuccess("Perfil atualizado", "As tuas alterações foram guardadas.")
        } catch (e) {
            profileSaveError.value = `Não foi possível guardar. ${describeListMutationFailure(e)}`
            toastFromListMutationError(e, { mode: "save" })
        } finally {
            savingProfile.value = false
        }
    }

    return {
        profileSaveError,
        savingProfile,
        saveProfile,
    }
}
