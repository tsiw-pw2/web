import { useLoginForm } from "@/modules/auth/composables/login/useLoginForm"
import { useLoginSubmit } from "@/modules/auth/composables/login/useLoginSubmit"

// Composable que gere a lógica de autenticação página estado.
export function useLoginPageState() {
    const form = useLoginForm()
    const submitState = useLoginSubmit(form)

    return {
        ...form,
        ...submitState,
    }
}
