import { ref } from "vue"
import { useRouter } from "vue-router"
import { toastServiceUnavailable } from "@/infrastructure/appToast"
import { resolvePostAuthRedirect } from "@/modules/auth/lib/postAuthRedirect"
import { REGISTER_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/registerFormConstants"
import type { useRegisterForm } from "@/modules/auth/composables/register/useRegisterForm"
import { isRegisterServiceUnavailableError, registerWithCredentials, } from "@/modules/auth/services/register"

// Composable que gere a lógica de registo submissão.
export function useRegisterSubmit(form: ReturnType<typeof useRegisterForm>) {
    const router = useRouter()
    const isSubmitting = ref(false)

// Valida o formulário, regista a conta e redirecciona após autenticação.
    async function submit() {
        form.clearErrors()

        if (form.password.value !== form.confirmPassword.value) {
            form.setFormError("A confirmação não coincide com a palavra-passe.")
            return
        }

        if (!form.acceptedTerms.value) {
            form.setFormError("Aceita os termos e a política de privacidade para continuar.")
            return
        }

        isSubmitting.value = true
        try {
            await registerWithCredentials(
                form.name.value.trim(),
                form.email.value.trim(),
                form.password.value,
            )
            const destination = await resolvePostAuthRedirect(undefined)
            await router.push(destination)
        } catch (err) {
            if (isRegisterServiceUnavailableError(err)) {
                toastServiceUnavailable(err.message)
                return
            }
            const msg =
                err instanceof Error && typeof err.message === "string" && err.message.length > 0
                    ? err.message
                    : REGISTER_GENERIC_ERROR_MESSAGE
            form.setFormError(msg)
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        isSubmitting,
        submit,
    }
}
