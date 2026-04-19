import { onMounted, ref } from "vue"
import {
	addCampaign,
	campaignsListRef,
	loadCampaignsList,
	removeCampaign,
	updateCampaign,
} from "@/modules/campaigns/services/campaignsList"

export type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"

export function useCampaignsPageData() {
	const loading = ref(true)
	const error = ref(false)

	async function load() {
		loading.value = true
		error.value = false
		try {
			await loadCampaignsList()
		} catch {
			error.value = true
		} finally {
			loading.value = false
		}
	}

	onMounted(load)

	return {
		loading,
		error,
		campaigns: campaignsListRef,
		reload: load,
		removeCampaign,
		addCampaign,
		updateCampaign,
	}
}
