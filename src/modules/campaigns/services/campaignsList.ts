import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import { ref } from "vue"
import { mockUuid } from "@/shared/lib/mockUuid"
import { requestJson } from "@/infrastructure/request"

const CAMPAIGN_SEED: readonly CampaignListItem[] = [
	{
		id: "1",
		title: "Verão à vista",
		municipality: "Braga",
		beach: "Praia da Ramalha, Praia de Belinho",
		startDate: "03/04/2026",
		endDate: "03/04/2026",
	},
]

const districtLabel: Record<string, string> = {
	braganca: "Bragança",
	porto: "Porto",
	lisboa: "Lisboa",
	faro: "Faro",
}

const campaigns = ref<CampaignListItem[]>([])
let mockInitialized = false

function mapDraftToItem(draft: CampaignCreateDraft): CampaignListItem {
	const municipality = districtLabel[draft.district] ?? draft.district
	const beach =
		draft.information.trim().length > 0 ? draft.information.trim().slice(0, 120) : "—"
	return {
		id: mockUuid(),
		title: draft.title.trim(),
		municipality,
		beach,
		startDate: draft.startDate.trim(),
		endDate: draft.endDate.trim().length > 0 ? draft.endDate.trim() : "—",
	}
}

export async function loadCampaignsList(): Promise<void> {
	if (import.meta.env.VITE_USE_API_CAMPAIGNS === "true") {
		campaigns.value = await requestJson<CampaignListItem[]>("/campaigns")
		mockInitialized = true
		return
	}
	await Promise.resolve()
	if (!mockInitialized) {
		campaigns.value = CAMPAIGN_SEED.map((row) => ({ ...row }))
		mockInitialized = true
	}
}

export function removeCampaign(id: string) {
	const index = campaigns.value.findIndex((c) => c.id === id)
	if (index !== -1) campaigns.value.splice(index, 1)
}

export function addCampaign(draft: CampaignCreateDraft) {
	campaigns.value.push(mapDraftToItem(draft))
}

export function districtCodeFromMunicipalityLabel(label: string): string | undefined {
	const entry = Object.entries(districtLabel).find(([, value]) => value === label)
	return entry?.[0]
}

export function updateCampaign(id: string, draft: CampaignCreateDraft) {
	const row = campaigns.value.find((c) => c.id === id)
	if (!row) return
	const municipality = districtLabel[draft.district] ?? draft.district
	const beach =
		draft.information.trim().length > 0 ? draft.information.trim().slice(0, 120) : "—"
	row.title = draft.title.trim()
	row.municipality = municipality
	row.beach = beach
	row.startDate = draft.startDate.trim()
	row.endDate = draft.endDate.trim().length > 0 ? draft.endDate.trim() : "—"
}

export { campaigns as campaignsListRef }
