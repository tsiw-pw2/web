import { requestJson } from "@/infrastructure/request"
import type { DashboardOverview } from "../types"

const placeholderOverview: DashboardOverview = {
	metrics: {
		campaignCount: 4,
		beachCount: 7,
		volunteerCount: 74,
	},
	cleaningStatsRows: [
		{ label: "Campanhas concluídas", value: "12" },
		{ label: "Kg recolhidos", value: "2340" },
		{ label: "Resíduos apanhados", value: "18420" },
		{ label: "Resíduo mais comum", value: "12" },
	],
	nextCampaignRows: [
		{ label: "Título", value: "Limpeza Solidária" },
		{ label: "Data", value: "8 de abril" },
		{ label: "Inscritos", value: "8" },
		{ label: "Praias", value: "2" },
	],
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
	if (import.meta.env.VITE_USE_API_DASHBOARD === "true") {
		return requestJson<DashboardOverview>("/dashboard/overview")
	}
	return Promise.resolve(placeholderOverview)
}
