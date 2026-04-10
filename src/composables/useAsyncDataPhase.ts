import { computed, type Ref } from "vue"

export type AsyncDataPhase = "loading" | "error" | "empty" | "success"

export function useAsyncDataPhase(
    loading: Ref<boolean>,
    error: Ref<string | null | undefined>,
    isEmpty: Ref<boolean>,
): Ref<AsyncDataPhase> {
    return computed(() => {
        if (loading.value) return "loading"
        if (error.value) return "error"
        if (isEmpty.value) return "empty"
        return "success"
    })
}
