import { useRequestAccountForm } from "@/modules/access-request/composables/request-account/useRequestAccountForm"
import { useRequestAccountSubmit } from "@/modules/access-request/composables/request-account/useRequestAccountSubmit"

// Composable que gere a lógica de pedido conta página estado.
export function useRequestAccountPageState() {
    const form = useRequestAccountForm()
    const submit = useRequestAccountSubmit(form)

    return {
        ...form,
        ...submit,
    }
}
