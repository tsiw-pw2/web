import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { href } from "@/infrastructure/apiDiscovery"
import { apiPatch } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { fetchWasteItem } from "@/modules/waste/services/waste/fetchWasteItem"

type WasteResource = WasteListItem & { links?: ResourceLinks }

// Actualiza um item de resíduo existente com os dados do rascunho.
export async function updateWaste(
    idOrResource: string | WasteResource,
    draft: WasteUpsertDraft,
): Promise<WasteListItem> {
    const resource =
        typeof idOrResource === "string" ? await fetchWasteItem(idOrResource) : idOrResource
    const body = {
        name: draft.name,
        categoryId: draft.categoryId,
        unit: draft.unit,
        averageWeightGrams:
            draft.unit === "peso" && draft.averageWeightGrams != null
                ? String(draft.averageWeightGrams)
                : "",
    }
    if (getLink(resource, "update")) {
        return followLink<WasteListItem>(resource, "update", { method: "PATCH", body })
    }
    const base = await href("wasteItems")
    return apiPatch<WasteListItem>(`${base}/${resource.id}`, body)
}
