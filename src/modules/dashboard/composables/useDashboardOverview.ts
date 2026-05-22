import { getDashboardOverview } from "@/modules/dashboard/services/getOverview"
import type { DashboardOverview } from "@/modules/dashboard/types"
import { onMounted, ref } from "vue"

export function useDashboardOverview() {
    const overview = ref<DashboardOverview | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    async function load() {
        loading.value = true
        error.value = null
        try {
            const data = await getDashboardOverview()
            overview.value = data != null && typeof data === "object" && "metrics" in data && data.metrics != null && typeof data.metrics === "object" ? data : null
        } catch {
            error.value = "Não foi possível carregar os dados. Tenta outra vez."
            overview.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(load)

    return { overview, loading, error, reload: load }
}
