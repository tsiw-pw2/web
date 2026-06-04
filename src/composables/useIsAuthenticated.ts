import { computed, type ComputedRef } from "vue"
import { accessToken } from "@/infrastructure/access-token"

// Composable reactivo que indica se existe sessão autenticada.
export function useIsAuthenticated(): ComputedRef<boolean> {
    return computed(() => {
        const token = accessToken.value
        return typeof token === "string" && token.length > 0
    })
}
