import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { href } from "@/infrastructure/apiDiscovery"
import { apiPatch } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type BeachResource = BeachListItem & { links?: ResourceLinks }

// Actualiza uma praia existente com os dados do rascunho.
export async function updateBeach(
    idOrResource: string | BeachResource,
    draft: BeachUpsertDraft,
): Promise<BeachListItem> {
    const resource = typeof idOrResource === "string" ? { id: idOrResource } : idOrResource
    const body = {
        name: draft.name,
        municipality: draft.municipality,
        district: draft.district,
        latitude: draft.latitude,
        longitude: draft.longitude,
    }
    if (getLink(resource, "update")) {
        return followLink<BeachListItem>(resource, "update", { method: "PATCH", body })
    }
    const base = await href("beaches")
    return apiPatch<BeachListItem>(`${base}/${resource.id}`, body)
}
