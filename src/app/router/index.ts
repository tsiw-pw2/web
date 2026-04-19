import { createRouter, createWebHistory } from "vue-router"
import { routePaths } from "./routePaths"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: "/", redirect: routePaths.dashboard },
		{
			path: routePaths.dashboard,
			name: "dashboard",
			component: () => import("../../modules/dashboard/pages/DashboardPage.vue"),
		},
		{
			path: routePaths.campaigns,
			name: "campaigns",
			component: () => import("../../modules/campaigns/views/pages/CampaignsPage.vue"),
		},
		{
			path: routePaths.campaignDetails,
			name: "campaign-details",
			component: () => import("../../modules/campaigns/views/pages/CampaignDetailsPage.vue"),
		},
		{
			path: routePaths.beaches,
			name: "beaches",
			component: () => import("../../modules/beaches/pages/BeachesPage.vue"),
		},
		{
			path: routePaths.waste,
			name: "waste",
			component: () => import("../../modules/waste/pages/WastePage.vue"),
		},
		{
			path: routePaths.settings,
			name: "settings",
			component: () => import("../../modules/settings/pages/SettingsPage.vue"),
		},
	],
})

export { router }
export { routePaths } from "./routePaths"
