import { computed, ref, watch } from "vue"
import { REGISTER_FIELD_ERROR_CLASS, REGISTER_PASSWORD_MIN_LENGTH } from "@/modules/auth/lib/registerFormConstants"

export function useRegisterForm() {
    const name = ref("")
    const email = ref("")
    const password = ref("")
    const confirmPassword = ref("")
    const acceptedTerms = ref(false)
    const formError = ref<string | null>(null)

    const canSubmit = computed(() => {
        return (
            name.value.trim().length > 0 &&
            email.value.trim().length > 0 &&
            password.value.length >= REGISTER_PASSWORD_MIN_LENGTH &&
            confirmPassword.value === password.value &&
            acceptedTerms.value
        )
    })

    const fieldHasError = computed(() => formError.value != null)

    function clearErrors() {
        formError.value = null
    }

    function setFormError(message: string) {
        formError.value = message
    }

    watch([name, email, password, confirmPassword, acceptedTerms], clearErrors)

    return {
        name,
        email,
        password,
        confirmPassword,
        acceptedTerms,
        formError,
        canSubmit,
        fieldHasError,
        fieldErrorClass: REGISTER_FIELD_ERROR_CLASS,
        clearErrors,
        setFormError,
    }
}
