import { createRouter, createWebHistory } from "vue-router"
import { routePaths } from "./routePaths"
import { useAuth } from "../../composables/useAuth"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", redirect: routePaths.dashboard },
        {
            path: routePaths.login,
            name: "login",
            meta: { public: true },
            component: () => import("../../pages/LoginPage.vue"),
        },
        {
            path: routePaths.register,
            name: "register",
            meta: { public: true },
            component: () => import("../../pages/RegisterPage.vue"),
        },
        {
            path: routePaths.dashboard,
            name: "dashboard",
            component: () => import("../../pages/DashboardPage.vue"),
        },
        {
            path: routePaths.campanhas,
            name: "campanhas",
            component: () => import("../../pages/CampanhasPage.vue"),
        },
        {
            path: routePaths.praias,
            name: "praias",
            component: () => import("../../pages/PraiasPage.vue"),
        },
        {
            path: routePaths.residuos,
            name: "residuos",
            component: () => import("../../pages/ResiduosPage.vue"),
        },
        {
            path: routePaths.definicoes,
            name: "definicoes",
            component: () => import("../../pages/DefinicoesPage.vue"),
        },
    ],
})

router.beforeEach(async (to) => {
    const auth = useAuth()
    await auth.bootstrap()
    if (to.meta.public) {
        if (auth.isAuthenticated.value) {
            return { path: routePaths.dashboard }
        }
        return true
    }
    if (!auth.isAuthenticated.value) {
        return { path: routePaths.login, query: { redirect: to.fullPath } }
    }
    return true
})

export { router }
export { routePaths } from "./routePaths"
