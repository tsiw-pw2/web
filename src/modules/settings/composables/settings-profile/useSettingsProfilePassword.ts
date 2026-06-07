import { computed, ref } from "vue"
import { changeProfilePassword } from "@/modules/settings/services/profile"
import { tryRestoreSession } from "@/infrastructure/authSession"
import { describeListMutationFailure, toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import { isApiRequestError } from "@/infrastructure/request"

// Composable que gere a lógica de definições perfil palavra-passe.
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

// Repõe palavra-passe formulário.
    function resetPasswordForm() {
        currentPassword.value = ""
        newPassword.value = ""
        confirmPassword.value = ""
        passwordSaveError.value = null
    }

// Valida e altera a palavra-passe, renovando a sessão em caso de sucesso.
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
            await tryRestoreSession()
            await changeProfilePassword({
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            })
            resetPasswordForm()
            toastSuccess("Palavra-passe atualizada", "A tua sessão foi renovada com segurança.")
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 400 && e.message.includes("palavra-passe actual")) {
                passwordSaveError.value = e.message
                toastError("Não foi possível guardar", e.message)
            } else {
                passwordSaveError.value = `Não foi possível alterar a palavra-passe. ${describeListMutationFailure(e)}`
                toastFromListMutationError(e, { mode: "save" })
            }
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
