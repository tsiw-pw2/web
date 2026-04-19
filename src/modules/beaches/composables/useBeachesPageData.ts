import { onMounted, ref } from "vue"
import {
	addBeach,
	beachesListRef,
	loadBeachesList,
	removeBeach,
	updateBeach,
} from "@/modules/beaches/services/beachesList"

export type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"

export function useBeachesPageData() {
	const loading = ref(true)
	const error = ref(false)

	async function load() {
		loading.value = true
		error.value = false
		try {
			await loadBeachesList()
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
		beaches: beachesListRef,
		reload: load,
		removeBeach,
		addBeach,
		updateBeach,
	}
}
