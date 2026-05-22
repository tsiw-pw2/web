import { useLoginForm } from "@/modules/auth/composables/login/useLoginForm"
import { useLoginSubmit } from "@/modules/auth/composables/login/useLoginSubmit"

export function useLoginPageState() {
    const form = useLoginForm()
    const submitState = useLoginSubmit(form)

    return {
        ...form,
        ...submitState,
    }
}
