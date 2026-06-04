import type { InjectionKey } from "vue"
import { inject } from "vue"

export type ModalCloseGuard = {
    requestClose: () => void
}

export const modalCloseGuardKey: InjectionKey<ModalCloseGuard> = Symbol("modalCloseGuard")

// Composable que gere a lógica de modal close protecção.
export function useModalCloseGuard() {
    const guard = inject(modalCloseGuardKey, null)
    return {
        requestClose: () => guard?.requestClose(),
    }
}
