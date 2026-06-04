import type { WasteCategory, WasteCategoryUpsertDraft } from "@/modules/waste/types/wasteCategory"
import { href } from "@/infrastructure/apiDiscovery"
import { apiDelete, apiGet, apiPatch, paginationQuery, unwrapList } from "@/infrastructure/apiClient"
import { followHref, followLink, getLink } from "@/infrastructure/hypermediaClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import type { PaginatedResult } from "@/types/pagination"

type WasteCategoryResource = WasteCategory & { links?: ResourceLinks }

// Obtém a listagem paginada de categorias de resíduo.
export async function fetchWasteCategories(page = 1, pageSize = 100) {
    const path = await href("wasteCategories")
    const q = paginationQuery(page, pageSize)
    const body = await apiGet<{
        data: WasteCategory[]
        page?: number
        pageSize?: number
        total?: number
    }>(path, q)
    return unwrapList<WasteCategory>(body) as PaginatedResult<WasteCategory>
}

// Cria uma nova categoria de resíduo.
export async function createWasteCategory(draft: WasteCategoryUpsertDraft): Promise<WasteCategory> {
    const path = await href("wasteCategories")
    return followHref<WasteCategory>(
        { href: path, method: "POST" },
        { method: "POST", body: { name: draft.name } },
    )
}

// Actualiza uma categoria de resíduo existente.
export async function updateWasteCategory(
    idOrResource: string | WasteCategoryResource,
    draft: WasteCategoryUpsertDraft,
): Promise<WasteCategory> {
    const resource = typeof idOrResource === "string" ? { id: idOrResource } : idOrResource
    if (getLink(resource, "update")) {
        return followLink<WasteCategory>(resource, "update", { method: "PATCH", body: { name: draft.name } })
    }
    const base = await href("wasteCategories")
    return apiPatch<WasteCategory>(`${base}/${resource.id}`, { name: draft.name })
}

// Elimina uma categoria de resíduo pelo identificador ou recurso com links.
export async function deleteWasteCategory(idOrResource: string | WasteCategoryResource): Promise<void> {
    const resource = typeof idOrResource === "string" ? { id: idOrResource } : idOrResource
    if (getLink(resource, "delete")) {
        await followLink(resource, "delete", { method: "DELETE" })
        return
    }
    const base = await href("wasteCategories")
    await apiDelete(`${base}/${resource.id}`)
}
