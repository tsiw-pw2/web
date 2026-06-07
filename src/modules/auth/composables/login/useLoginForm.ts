import { computed, ref, watch } from "vue"
import { LOGIN_FIELD_ERROR_CLASS } from "@/modules/auth/lib/loginFormConstants"

// Composable que gere a lógica de autenticação formulário.
export function useLoginForm() {
    const email = ref("")
    const password = ref("")
    const credentialsError = ref<string | null>(null)
    const isAccountBlockedHighlight = ref(false)

    const loginFieldHasError = computed(
        () => credentialsError.value != null || isAccountBlockedHighlight.value,
    )

    // Remove o realce visual de conta bloqueada no login.
    function clearFieldHighlights() {
        isAccountBlockedHighlight.value = false
    }

    // Limpa o erro de credenciais do login.
    function clearCredentialsError() {
        credentialsError.value = null
    }

    // Limpa erros e realces do formulário de login.
    function clearErrors() {
        clearCredentialsError()
        clearFieldHighlights()
    }

    // Define credentials erro.
    function setCredentialsError(message: string) {
        credentialsError.value = message
    }

    // Define conta blocked realce.
    function setAccountBlockedHighlight() {
        isAccountBlockedHighlight.value = true
    }

    watch([email, password], clearFieldHighlights)

    return {
        email,
        password,
        credentialsError,
        isAccountBlockedHighlight,
        loginFieldHasError,
        loginFieldErrorClass: LOGIN_FIELD_ERROR_CLASS,
        clearErrors,
        setCredentialsError,
        setAccountBlockedHighlight,
    }
}
