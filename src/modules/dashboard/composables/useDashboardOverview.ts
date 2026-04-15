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
			overview.value = await getDashboardOverview()
		} catch {
			error.value = "Não foi possível carregar os dados. Tenta outra vez."
		} finally {
			loading.value = false
		}
	}

	onMounted(load)

	return { overview, loading, error, reload: load }
}
