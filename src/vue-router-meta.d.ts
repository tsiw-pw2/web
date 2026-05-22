import "vue-router"

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean
        bodyScroll?: boolean
        hideChrome?: boolean
    }
}

export {}
