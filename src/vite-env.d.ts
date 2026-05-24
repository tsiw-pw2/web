/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string
    readonly VITE_SUPPORT_EMAIL?: string
    readonly VITE_PRIVACY_EMAIL?: string
    readonly VITE_API_URL?: string
    readonly VITE_API_BASE_URL?: string
    readonly VITE_DEV_API_PORT?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module "portuguese-municipalities/municipalities.json" {
    const value: { name?: string; district?: string }[]
    export default value
}
