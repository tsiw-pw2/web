import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toastAccountBlocked, toastServiceUnavailable } from "@/infrastructure/appToast"
import { resolvePostAuthRedirect } from "@/modules/auth/lib/postAuthRedirect"
import { LOGIN_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/loginFormConstants"
import type { useLoginForm } from "@/modules/auth/composables/login/useLoginForm"
import { isLoginAccountBlockedError, isLoginServiceUnavailableError, loginWithCredentials, } from "@/modules/auth/services/login"

// Composable que gere a lógica de autenticação submissão.
export function useLoginSubmit(form: ReturnType<typeof useLoginForm>) {
    const router = useRouter()
    const route = useRoute()
    const isSubmitting = ref(false)

// Autentica com email e palavra-passe e redirecciona para o destino pós-login.
    async function submit() {
        form.clearErrors()
        isSubmitting.value = true
        try {
            await loginWithCredentials(form.email.value.trim(), form.password.value)
            isSubmitting.value = false
            const destination = await resolvePostAuthRedirect(route.query.redirect)
            await router.push(destination)
        } catch (err) {
            if (isLoginServiceUnavailableError(err)) {
                toastServiceUnavailable(err.message)
                return
            }
            if (isLoginAccountBlockedError(err)) {
                form.setAccountBlockedHighlight()
                toastAccountBlocked("Conta bloqueada", err.message)
                return
            }
            const msg =
                err instanceof Error && typeof err.message === "string" && err.message.length > 0
                    ? err.message
                    : LOGIN_GENERIC_ERROR_MESSAGE
            form.setCredentialsError(msg)
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        isSubmitting,
        submit,
    }
}
