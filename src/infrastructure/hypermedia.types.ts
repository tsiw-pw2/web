export type ApiLink = {
    href: string
    method?: string
}

export type ResourceLinks = Record<string, ApiLink>

export type ApiRootResource = {
    id: string
    name: string
    version: string
    links: ResourceLinks
}

export type ListEnvelope<T> = {
    data: T[]
    links?: ResourceLinks
    page?: number
    pageSize?: number
    total?: number
}

export type HypermediaResource = {
    links?: ResourceLinks
    [key: string]: unknown
}

// Extrai links de um recurso ou listagem (contrato das aulas).
export function getResourceLinks(resource: unknown): ResourceLinks | undefined {
    if (!resource || typeof resource !== "object") return undefined
    const record = resource as Record<string, unknown>
    const links = record.links
    if (!links || typeof links !== "object") return undefined
    return links as ResourceLinks
}

// Extrai a mensagem de erro legível a partir do corpo de resposta da API.
export function extractApiErrorMessage(body: unknown): string | undefined {
    if (!body || typeof body !== "object") return undefined
    const record = body as Record<string, unknown>
    for (const key of ["message", "msg", "description", "error_description"] as const) {
        const value = record[key]
        if (typeof value === "string" && value.trim().length > 0) return value.trim()
    }
    return undefined
}
