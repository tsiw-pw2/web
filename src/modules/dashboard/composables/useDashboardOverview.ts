import { getDashboardOverview } from "@/modules/dashboard/services/getOverview"
import type { DashboardOverview } from "@/modules/dashboard/types"
import { describeApiLoadFailure } from "@/infrastructure/apiErrors"
import { isApiRequestError } from "@/infrastructure/request"
import { onMounted, ref } from "vue"

export function useDashboardOverview() {
    const overview = ref<DashboardOverview | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    async function load() {
        loading.value = true
        error.value = null
        try {
            overview.value = await getDashboardOverview()
        } catch (e) {
            if (isApiRequestError(e) && e.httpStatus === 403) {
                error.value = "Sem acesso a esta área."
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
