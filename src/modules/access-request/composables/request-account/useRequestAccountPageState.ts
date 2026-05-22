import { useRequestAccountForm } from "@/modules/access-request/composables/request-account/useRequestAccountForm"
import { useRequestAccountSubmit } from "@/modules/access-request/composables/request-account/useRequestAccountSubmit"

export function useRequestAccountPageState() {
    const form = useRequestAccountForm()
    const submit = useRequestAccountSubmit(form)

    return {
        ...form,
        ...submit,
    }
}
