import { computed, type ComputedRef } from "vue"
import { accessToken } from "@/infrastructure/access-token"

export function useIsAuthenticated(): ComputedRef<boolean> {
    return computed(() => {
        const token = accessToken.value
        return typeof token === "string" && token.length > 0
    })
}
