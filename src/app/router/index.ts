import { createRouter, createWebHistory } from "vue-router"
import { routePaths } from "./routePaths"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", redirect: routePaths.dashboard },
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

export { router }
export { routePaths } from "./routePaths"
