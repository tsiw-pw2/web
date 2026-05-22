import { ref } from "vue"
import { REQUEST_ACCOUNT_COPY_FEEDBACK_MS } from "@/modules/access-request/lib/requestAccountConstants"
import type { useRequestAccountForm } from "@/modules/access-request/composables/request-account/useRequestAccountForm"

export function useRequestAccountSubmit(form: ReturnType<typeof useRequestAccountForm>) {
    const copied = ref(false)
    let copiedTimeout: number | null = null

    async function copyModel() {
        try {
            await navigator.clipboard.writeText(form.modelEmail.value)
            copied.value = true
            if (copiedTimeout) window.clearTimeout(copiedTimeout)
            copiedTimeout = window.setTimeout(() => {
                copied.value = false
            }, REQUEST_ACCOUNT_COPY_FEEDBACK_MS)
        } catch {
            copied.value = false
        }
    }

    return {
        copied,
        copyModel,
    }
}
