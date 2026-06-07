import { apiGet } from "@/infrastructure/apiClient"
import { getAccessToken } from "@/infrastructure/access-token"
import type { ApiLink, ApiRootResource, ResourceLinks } from "@/infrastructure/hypermedia.types"

const API_ROOT_SESSION_KEY = "mariva.apiRoot"

let cachedRoot: ApiRootResource | null = null
let loadPromise: Promise<ApiRootResource> | null = null

function rootHasAuthenticatedLinks(root: ApiRootResource): boolean {
    return Boolean(root.links?.campaigns?.href && root.links?.userMe?.href)
}

function shouldInvalidateCachedRoot(): boolean {
    if (!cachedRoot) return false
    const token = getAccessToken()
    const hasAuthLinks = rootHasAuthenticatedLinks(cachedRoot)
    if (token && !hasAuthLinks) return true
    if (!token && hasAuthLinks) return true
    return false
}

function persistApiRootSession(root: ApiRootResource): void {
    if (!rootHasAuthenticatedLinks(root)) return
    try {
        sessionStorage.setItem(API_ROOT_SESSION_KEY, JSON.stringify(root))
    } catch {
        // sessionStorage indisponível
    }
}

function clearApiRootSession(): void {
    try {
        sessionStorage.removeItem(API_ROOT_SESSION_KEY)
    } catch {
        // Ignorar falhas de escrita
    }
}

// Restaura o índice hypermedia autenticado da sessão do browser (sobrevive a F5).
export function hydrateApiRootFromSession(): void {
    if (!getAccessToken()) return
    try {
        const raw = sessionStorage.getItem(API_ROOT_SESSION_KEY)
        if (!raw) return
        const root = JSON.parse(raw) as ApiRootResource
        if (rootHasAuthenticatedLinks(root)) {
            cachedRoot = root
        }
    } catch {
        // JSON inválido ou sessionStorage indisponível
    }
}

// Carregar índice hypermedia da API (GET /).
export async function loadApiRoot(force = false): Promise<ApiRootResource> {
    if (!force && shouldInvalidateCachedRoot()) {
        force = true
    }
    if (!force && cachedRoot) return cachedRoot
    if (!force && loadPromise) return loadPromise
    loadPromise = apiGet<ApiRootResource>("/")
        .then((root) => {
            cachedRoot = root
            persistApiRootSession(root)
            loadPromise = null
            return root
        })
        .catch((error) => {
            loadPromise = null
            throw error
        })
    return loadPromise
}

export function getCachedApiRoot(): ApiRootResource | null {
    return cachedRoot
}

export function clearApiRootCache(): void {
    cachedRoot = null
    loadPromise = null
    clearApiRootSession()
}

// Obter href de uma relação no índice (ex.: "campaigns", "userMe").
export async function href(rel: string): Promise<string> {
    const root = await loadApiRoot()
    const link = root.links[rel] as ApiLink | undefined
    if (!link?.href) {
        throw new Error(`API root link "${rel}" not found`)
    }
    return link.href
}

// Obter link completo do índice.
export async function rootLink(rel: string): Promise<ApiLink> {
    const root = await loadApiRoot()
    const link = root.links[rel] as ApiLink | undefined
    if (!link?.href) {
        throw new Error(`API root link "${rel}" not found`)
    }
    return link
}

export function rootLinks(): ResourceLinks | null {
    return cachedRoot?.links ?? null
}
