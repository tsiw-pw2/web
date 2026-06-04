import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { href } from "@/infrastructure/apiDiscovery"
import { apiDelete } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type BeachResource = { id: string; links?: ResourceLinks }

// Elimina uma praia pelo identificador ou recurso com links.
export async function deleteBeach(idOrResource: string | BeachResource): Promise<void> {
    const resource = typeof idOrResource === "string" ? { id: idOrResource } : idOrResource
    if (getLink(resource, "delete")) {
        await followLink(resource, "delete", { method: "DELETE" })
        return
    }
    const base = await href("beaches")
    await apiDelete(`${base}/${resource.id}`)
}
