import type { RouteLocationNormalized, Router } from "vue-router"
import { setDocumentTitle } from "@/app/lib/pageTitle"

function resolveRoutePageTitle(to: RouteLocationNormalized): string | null {
    for (let i = to.matched.length - 1; i >= 0; i -= 1) {
        const meta = to.matched[i]?.meta
        if (meta?.pageTitleDynamic === true) {
            const fallback = meta.pageTitle
            return typeof fallback === "string" ? fallback : null
        }
        if (typeof meta?.pageTitle === "string") {
            return meta.pageTitle
        }
    }
    return null
}

export function registerDocumentTitle(router: Router) {
    router.afterEach((to) => {
        setDocumentTitle(resolveRoutePageTitle(to))
    })
}
