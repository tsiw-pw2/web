import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { toastAccountBlocked, toastServiceUnavailable } from "@/infrastructure/appToast"
import { LOGIN_GENERIC_ERROR_MESSAGE } from "@/modules/auth/lib/loginFormConstants"
import {
    isLoginAccountBlockedError,
    isLoginServiceUnavailableError,
    loginWithCredentials,
} from "@/modules/auth/services/login"
import type { useLoginForm } from "@/modules/auth/composables/login/useLoginForm"
import { safeInternalRedirectPath } from "@/shared/lib/safeRedirect"

export function useLoginSubmit(form: ReturnType<typeof useLoginForm>) {
    const router = useRouter()
    const route = useRoute()
    const isSubmitting = ref(false)

    async function submit() {
        form.clearErrors()
        isSubmitting.value = true
        try {
            await loginWithCredentials(form.email.value.trim(), form.password.value)
            const redirect = safeInternalRedirectPath(route.query.redirect)
            await router.push(redirect ?? { name: "dashboard" })
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
