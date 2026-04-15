import { onMounted, ref } from "vue"

export type CampaignListItem = {
	id: string
	title: string
}

export function useCampaignsPageData() {
	const loading = ref(true)
	const error = ref(false)
	const campaigns = ref<CampaignListItem[]>([])

	async function load() {
		loading.value = true
		error.value = false
		try {
			await Promise.resolve()
			campaigns.value = []
		} catch {
			error.value = true
		} finally {
			loading.value = false
		}
	}

	onMounted(load)

	return { loading, error, campaigns, reload: load }
}
