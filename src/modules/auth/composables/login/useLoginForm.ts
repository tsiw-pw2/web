import { computed, ref, watch } from "vue"
import { LOGIN_FIELD_ERROR_CLASS } from "@/modules/auth/lib/loginFormConstants"

export function useLoginForm() {
    const email = ref("")
    const password = ref("")
    const credentialsError = ref<string | null>(null)
    const isAccountBlockedHighlight = ref(false)

    const canSubmit = computed(() => email.value.trim().length > 0 && password.value.trim().length > 0)

    const loginFieldHasError = computed(
        () => credentialsError.value != null || isAccountBlockedHighlight.value,
    )

    function clearFieldHighlights() {
        isAccountBlockedHighlight.value = false
    }

    function clearCredentialsError() {
        credentialsError.value = null
    }

    function clearErrors() {
        clearCredentialsError()
        clearFieldHighlights()
    }

    function setCredentialsError(message: string) {
        credentialsError.value = message
    }

    function setAccountBlockedHighlight() {
        isAccountBlockedHighlight.value = true
    }

    watch([email, password], clearFieldHighlights)

    return {
        email,
        password,
        credentialsError,
        isAccountBlockedHighlight,
        canSubmit,
        loginFieldHasError,
        loginFieldErrorClass: LOGIN_FIELD_ERROR_CLASS,
        clearErrors,
        setCredentialsError,
        setAccountBlockedHighlight,
    }
}
