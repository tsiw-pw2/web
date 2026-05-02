import { createRouter, createWebHistory } from "vue-router"
import { routePaths } from "./routePaths"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: routePaths.home,
			name: "home",
			component: () => import("../../modules/home/pages/HomePage.vue"),
			meta: { bodyScroll: true, hideChrome: true },
		},
		{
			path: routePaths.requestAccount,
			name: "request-account",
			component: () => import("../../modules/access-request/pages/RequestAccountPage.vue"),
			meta: { bodyScroll: true, hideChrome: true },
		},
		{
			path: routePaths.login,
			name: "login",
			component: () => import("../../modules/auth/pages/LoginPage.vue"),
			meta: { bodyScroll: true, hideChrome: true },
		},
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
