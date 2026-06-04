import { type MaybeRefOrGetter, toValue, watch } from "vue"
import { setDocumentTitle } from "@/app/lib/pageTitle"

// Composable que gere a lógica de documento título.
export function useDocumentTitle(segment: MaybeRefOrGetter<string | null | undefined>) {
    watch(
        () => toValue(segment),
        (value) => setDocumentTitle(value),
        { immediate: true },
    )
}
