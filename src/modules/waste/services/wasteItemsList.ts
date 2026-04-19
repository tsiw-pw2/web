import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { ref } from "vue"
import { mockUuid } from "@/shared/lib/mockUuid"
import { requestJson } from "@/infrastructure/request"

const WASTE_SEED: readonly WasteListItem[] = [
	{
		id: "1",
		name: "Garrafas PET",
		category: "plastic",
		unit: "kg",
	},
	{
		id: "2",
		name: "Vidro",
		category: "glass",
		unit: "kg",
	},
]

const items = ref<WasteListItem[]>([])
let mockInitialized = false

export async function loadWasteItemsList(): Promise<void> {
	if (import.meta.env.VITE_USE_API_WASTE === "true") {
		items.value = await requestJson<WasteListItem[]>("/waste")
		mockInitialized = true
		return
	}
	await Promise.resolve()
	if (!mockInitialized) {
		items.value = WASTE_SEED.map((row) => ({ ...row }))
		mockInitialized = true
	}
}

export function removeWaste(id: string) {
	const index = items.value.findIndex((w) => w.id === id)
	if (index !== -1) items.value.splice(index, 1)
}

export function addWaste(draft: WasteUpsertDraft) {
	items.value.push({
		id: mockUuid(),
		name: draft.name.trim(),
		category: draft.category,
		unit: draft.unit,
	})
}

export function updateWaste(id: string, draft: WasteUpsertDraft) {
	const row = items.value.find((w) => w.id === id)
	if (!row) return
	row.name = draft.name.trim()
	row.category = draft.category
	row.unit = draft.unit
}

export { items as wasteItemsListRef }
