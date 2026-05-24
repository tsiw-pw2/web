import { useRegisterForm } from "@/modules/auth/composables/register/useRegisterForm"
import { useRegisterSubmit } from "@/modules/auth/composables/register/useRegisterSubmit"

export function useRegisterPageState() {
    const form = useRegisterForm()
    const submitState = useRegisterSubmit(form)

    return {
        ...form,
        ...submitState,
    }
}
