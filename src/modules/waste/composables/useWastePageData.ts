import { onMounted, ref } from "vue"
import {
	addWaste,
	loadWasteItemsList,
	removeWaste,
	updateWaste,
	wasteItemsListRef,
} from "@/modules/waste/services/wasteItemsList"

export type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"

export function useWastePageData() {
	const loading = ref(true)
	const error = ref(false)

	async function load() {
		loading.value = true
		error.value = false
		try {
			await loadWasteItemsList()
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
		items: wasteItemsListRef,
		reload: load,
		removeWaste,
		addWaste,
		updateWaste,
	}
}
