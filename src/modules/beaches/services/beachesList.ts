import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { ref } from "vue"
import { mockUuid } from "@/shared/lib/mockUuid"
import { requestJson } from "@/infrastructure/request"

const BEACH_SEED: readonly BeachListItem[] = [
	{
		id: "1",
		name: "Praia da Aguda",
		municipality: "Esposende",
		district: "braga",
	},
	{
		id: "2",
		name: "Praia de Ofir",
		municipality: "Esposende",
		district: "braga",
	},
]

const beaches = ref<BeachListItem[]>([])
let mockInitialized = false

export async function loadBeachesList(): Promise<void> {
	if (import.meta.env.VITE_USE_API_BEACHES === "true") {
		beaches.value = await requestJson<BeachListItem[]>("/beaches")
		mockInitialized = true
		return
	}
	await Promise.resolve()
	if (!mockInitialized) {
		beaches.value = BEACH_SEED.map((row) => ({ ...row }))
		mockInitialized = true
	}
}

export function removeBeach(id: string) {
	const index = beaches.value.findIndex((b) => b.id === id)
	if (index !== -1) beaches.value.splice(index, 1)
}

export function addBeach(draft: BeachUpsertDraft) {
	beaches.value.push({
		id: mockUuid(),
		name: draft.name.trim(),
		municipality: draft.municipality.trim(),
		district: draft.district,
	})
}

export function updateBeach(id: string, draft: BeachUpsertDraft) {
	const row = beaches.value.find((b) => b.id === id)
	if (!row) return
	row.name = draft.name.trim()
	row.municipality = draft.municipality.trim()
	row.district = draft.district
}

export { beaches as beachesListRef }
