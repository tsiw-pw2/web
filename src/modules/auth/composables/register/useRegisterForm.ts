import { computed, ref, watch } from "vue"
import { REGISTER_FIELD_ERROR_CLASS } from "@/modules/auth/lib/registerFormConstants"

// Composable que gere a lógica de registo formulário.
export function useRegisterForm() {
    const name = ref("")
    const email = ref("")
    const birthDate = ref("")
    const password = ref("")
    const confirmPassword = ref("")
    const acceptedTerms = ref(false)
    const formError = ref<string | null>(null)

    const fieldHasError = computed(() => formError.value != null)

// Limpa a mensagem de erro do formulário de registo.
    function clearErrors() {
        formError.value = null
    }

// Define formulário erro.
    function setFormError(message: string) {
        formError.value = message
    }

    watch([name, email, birthDate, password, confirmPassword, acceptedTerms], clearErrors)

    return {
        name,
        email,
        birthDate,
        password,
        confirmPassword,
        acceptedTerms,
        formError,
        fieldHasError,
        fieldErrorClass: REGISTER_FIELD_ERROR_CLASS,
        clearErrors,
        setFormError,
    }
}
