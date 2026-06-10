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
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Pedir acesso" },
        },
        {
            path: routePaths.login,
            name: "login",
            component: () => import("../../modules/auth/pages/LoginPage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Entrar" },
        },
        {
            path: routePaths.register,
            name: "register",
            component: () => import("../../modules/auth/pages/RegisterPage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Registar" },
        },
        {
            path: routePaths.componentShowcase,
            name: "component-showcase",
            component: () => import("../../modules/dev/pages/ComponentShowcasePage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Componentes" },
        },
        {
            path: routePaths.privacy,
            name: "privacy",
            component: () => import("../../modules/legal/pages/PrivacyPolicyPage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Política de privacidade" },
        },
        {
            path: routePaths.terms,
            name: "terms",
            component: () => import("../../modules/legal/pages/TermsOfUsePage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Termos de utilização" },
        },
        {
            path: routePaths.help,
            name: "help",
            component: () => import("../../modules/legal/pages/HelpContactPage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Ajuda e contacto" },
        },
        {
            path: routePaths.dashboard,
            name: "dashboard",
            component: () => import("../../modules/dashboard/pages/DashboardPage.vue"),
            meta: { requiresAuth: true, requiresCapability: "dashboard", pageTitle: "Dashboard" },
        },
        {
            path: routePaths.campaigns,
            name: "campaigns",
            component: () => import("../../modules/campaigns/views/pages/CampaignsPage.vue"),
            meta: { requiresAuth: true, pageTitle: "Campanhas" },
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
            meta: { requiresAuth: true, pageTitle: "Campanha", pageTitleDynamic: true },
        },
        {
            path: routePaths.beaches,
            name: "beaches",
            component: () => import("../../modules/beaches/pages/BeachesPage.vue"),
            meta: { requiresAuth: true, pageTitle: "Praias" },
        },
        {
            path: routePaths.waste,
            name: "waste",
            component: () => import("../../modules/waste/pages/WastePage.vue"),
            meta: { requiresAuth: true, pageTitle: "Resíduos" },
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
                if (tab === "seguranca" || tab === "security") {
                    return { name: "settings-security", query }
                }
                if (tab === "users") {
                    return { name: "settings-users", query }
                }
                if (tab === "categorias-residuos" || tab === "waste-categories") {
                    return { name: "settings-waste-categories", query }
                }
                return { name: "settings-profile", query }
            },
            children: [
                {
                    path: "perfil",
                    name: "settings-profile",
                    component: () => import("../../modules/settings/pages/SettingsProfilePage.vue"),
                    meta: { requiresAuth: true, pageTitle: "Perfil" },
                },
                {
                    path: "seguranca",
                    name: "settings-security",
                    component: () => import("../../modules/settings/pages/SettingsSecurityPage.vue"),
                    meta: { requiresAuth: true, pageTitle: "Segurança" },
                },
                {
                    path: "utilizadores",
                    name: "settings-users",
                    component: () => import("../../modules/settings/pages/SettingsUsersPage.vue"),
                    meta: { requiresAuth: true, requiresCapability: "settingsAdmin", pageTitle: "Utilizadores" },
                },
                {
                    path: "utilizadores/:userId",
                    redirect: (to) => ({
                        name: "settings-user-details",
                        params: { userId: to.params.userId, tab: "informacao" },
                    }),
                },
                {
                    path: "utilizadores/:userId/:tab",
                    name: "settings-user-details",
                    component: () => import("../../modules/settings/pages/SettingsUserDetailsPage.vue"),
                    meta: {
                        requiresAuth: true,
                        requiresCapability: "settingsAdmin",
                        pageTitle: "Utilizador",
                        pageTitleDynamic: true,
                    },
                },
                {
                    path: "categorias-residuos",
                    name: "settings-waste-categories",
                    component: () => import("../../modules/settings/pages/SettingsWasteCategoriesPage.vue"),
                    meta: { requiresAuth: true, requiresCapability: "settingsAdmin", pageTitle: "Categorias de resíduos" },
                },
            ],
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("../../modules/errors/pages/NotFoundPage.vue"),
            meta: { bodyScroll: true, hideChrome: true, pageTitle: "Página não encontrada" },
        },
    ],
})

export { router }
export { routePaths } from "./routePaths"
