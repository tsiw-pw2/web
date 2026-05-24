import "vue-router"

import type { AccessCapability } from "@/modules/auth/lib/accessPolicy"

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean
        requiresCapability?: AccessCapability
        bodyScroll?: boolean
        hideChrome?: boolean
        pageTitle?: string
        pageTitleDynamic?: boolean
    }
}

export {}
