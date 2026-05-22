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
            path: routePaths.componentShowcase,
            name: "component-showcase",
            component: () => import("../../modules/dev/pages/ComponentShowcasePage.vue"),
            meta: { bodyScroll: true, hideChrome: true },
        },
        {
            path: routePaths.dashboard,
            name: "dashboard",
            component: () => import("../../modules/dashboard/pages/DashboardPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: routePaths.campaigns,
            name: "campaigns",
            component: () => import("../../modules/campaigns/views/pages/CampaignsPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/campanhas/:campaignId",
            redirect: (to) => ({
                name: "campaign-details",
                params: { campaignId: to.params.campaignId, tab: "informacoes" },
            }),
        },
        {
            path: routePaths.campaignDetails,
            name: "campaign-details",
            component: () => import("../../modules/campaigns/views/pages/CampaignDetailsPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: routePaths.beaches,
            name: "beaches",
            component: () => import("../../modules/beaches/pages/BeachesPage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: routePaths.waste,
            name: "waste",
            component: () => import("../../modules/waste/pages/WastePage.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: routePaths.settings,
            component: () => import("../../modules/settings/pages/SettingsLayout.vue"),
            meta: { requiresAuth: true },
            redirect: (to) => {
                const tab = to.query.tab
                const query = { ...to.query } as Record<string, string | string[] | null | undefined>
                delete query.tab
                if (tab === "perfil" || tab === "profile") {
                    return { name: "settings-profile", query }
                }
                if (tab === "users") {
                    return { name: "settings-users", query }
                }
                return { name: "settings-profile", query }
            },
            children: [
                {
                    path: "perfil",
                    name: "settings-profile",
                    component: () => import("../../modules/settings/pages/SettingsProfilePage.vue"),
                    meta: { requiresAuth: true },
                },
                {
                    path: "utilizadores",
                    name: "settings-users",
                    component: () => import("../../modules/settings/pages/SettingsUsersPage.vue"),
                    meta: { requiresAuth: true },
                },
            ],
        },
    ],
})

export { router }
export { routePaths } from "./routePaths"
