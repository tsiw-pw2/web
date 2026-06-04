import {
    apiDelete,
    apiGet,
    apiPatch,
    apiPatchFormData,
    apiPost,
    apiPut,
    unwrapList,
} from "@/infrastructure/apiClient"
import { getResourceLinks } from "@/infrastructure/hypermedia.types"
import type { ApiLink, HypermediaResource, ResourceLinks } from "@/infrastructure/hypermedia.types"
import type { PaginatedResult } from "@/types/pagination"

export type FollowInit = {
    method?: string
    body?: unknown
    formData?: FormData
    query?: URLSearchParams
}

// Obter link de um recurso por relação.
export function getLink(resource: unknown, rel: string): ApiLink | undefined {
    const links = getResourceLinks(resource)
    return links?.[rel]
}

function resolveHref(link: ApiLink, query?: URLSearchParams): string {
    if (!query || query.toString().length === 0) return link.href
    const sep = link.href.includes("?") ? "&" : "?"
    return `${link.href}${sep}${query.toString()}`
}

// Executar pedido HTTP conforme método do link.
export async function followHref<T>(link: ApiLink, init: FollowInit = {}): Promise<T> {
    const method = (init.method ?? link.method ?? "GET").toUpperCase()
    const path = resolveHref(link, init.query)

    if (method === "GET") return apiGet<T>(path)
    if (method === "POST") return apiPost<T>(path, init.body)
    if (method === "PATCH") {
        if (init.formData) return apiPatchFormData<T>(path, init.formData)
        return apiPatch<T>(path, init.body)
    }
    if (method === "PUT") return apiPut<T>(path, init.body)
    if (method === "DELETE") {
        await apiDelete(path)
        return null as T
    }
    throw new Error(`Unsupported link method: ${method}`)
}

// Seguir relação hypermedia de um recurso.
export async function followLink<T>(resource: unknown, rel: string, init: FollowInit = {}): Promise<T> {
    const link = getLink(resource, rel)
    if (!link?.href) {
        throw new Error(`Link "${rel}" not found on resource`)
    }
    return followHref<T>(link, init)
}

// Listagem paginada via link (ex.: self, next).
export async function followListLink<T>(
    links: ResourceLinks | undefined,
    rel: string,
    fallbackPath: string,
    page: number,
    pageSize: number,
): Promise<PaginatedResult<T>> {
    const link = links?.[rel]
    const query = new URLSearchParams()
    query.set("page", String(page))
    query.set("pageSize", String(pageSize))

    if (link?.href) {
        const body = await followHref<{ data: T[]; page?: number; pageSize?: number; total?: number }>(link, {
            query,
        })
        return unwrapList(body)
    }

    const body = await apiGet<{ data: T[]; page?: number; pageSize?: number; total?: number }>(
        fallbackPath,
        query,
    )
    return unwrapList(body)
}

export type { HypermediaResource, ResourceLinks }
