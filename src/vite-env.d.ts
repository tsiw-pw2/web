/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_NAME?: string
	readonly VITE_API_URL: string
	readonly VITE_USE_API_DASHBOARD?: string
	readonly VITE_USE_API_CAMPAIGNS?: string
	readonly VITE_USE_API_BEACHES?: string
	readonly VITE_USE_API_WASTE?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
