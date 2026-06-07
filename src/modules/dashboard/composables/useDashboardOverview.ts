import { getDashboardOverview } from "@/modules/dashboard/services/getOverview"
import type { DashboardOverview } from "@/modules/dashboard/types"
import { describeApiLoadFailure, isApiServiceUnavailableError } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"
import { onMounted, ref } from "vue"

// Composable que gere a lógica de painel visão geral.
export function useDashboardOverview() {
    const overview = ref<DashboardOverview | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

// Carrega .
    async function load() {
        loading.value = true
        error.value = null
        try {
            overview.value = await getDashboardOverview()
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 403) {
                error.value = "Sem acesso a esta área."
            } else if (isApiServiceUnavailableError(e)) {
                error.value = e.friendlyMessage
            } else {
                error.value = describeApiLoadFailure(e, "os dados")
            }
            overview.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(load)

    return { overview, loading, error, reload: load }
}
