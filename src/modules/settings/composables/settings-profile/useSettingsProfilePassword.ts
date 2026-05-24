import { computed, ref } from "vue"
import { changeProfilePassword } from "@/modules/settings/services/profile"
import { describeListMutationFailure, toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"

export function useSettingsProfilePassword() {
    const currentPassword = ref("")
    const newPassword = ref("")
    const confirmPassword = ref("")
    const passwordSaveError = ref<string | null>(null)
    const savingPassword = ref(false)

    const canSavePassword = computed(() => {
        return (
            currentPassword.value.length > 0 &&
            newPassword.value.length >= 8 &&
            confirmPassword.value === newPassword.value
        )
    })

    function resetPasswordForm() {
        currentPassword.value = ""
        newPassword.value = ""
        confirmPassword.value = ""
        passwordSaveError.value = null
    }

    async function savePassword() {
        passwordSaveError.value = null
        if (newPassword.value !== confirmPassword.value) {
            passwordSaveError.value = "A confirmação não coincide com a nova palavra-passe."
            return
        }
        if (newPassword.value.length < 8) {
            passwordSaveError.value = "A nova palavra-passe deve ter pelo menos 8 caracteres."
            return
        }
        savingPassword.value = true
        try {
            await changeProfilePassword({
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            })
            resetPasswordForm()
            toastSuccess("Palavra-passe atualizada", "A tua sessão foi renovada com segurança.")
        } catch (e) {
            passwordSaveError.value = `Não foi possível alterar a palavra-passe. ${describeListMutationFailure(e)}`
            toastFromListMutationError(e, { mode: "save" })
        } finally {
            savingPassword.value = false
        }
    }

    return {
        currentPassword,
        newPassword,
        confirmPassword,
        passwordSaveError,
        savingPassword,
        canSavePassword,
        savePassword,
        resetPasswordForm,
    }
}
