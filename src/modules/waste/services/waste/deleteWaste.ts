import { followLink, getLink } from "@/infrastructure/hypermediaClient"
import { href } from "@/infrastructure/apiDiscovery"
import { apiDelete } from "@/infrastructure/apiClient"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

type WasteResource = { id: string; links?: ResourceLinks }

// Elimina um item de resíduo pelo identificador ou recurso com links.
export async function deleteWaste(idOrResource: string | WasteResource): Promise<void> {
    const resource = typeof idOrResource === "string" ? { id: idOrResource } : idOrResource
    if (getLink(resource, "delete")) {
        await followLink(resource, "delete", { method: "DELETE" })
        return
    }
    const base = await href("wasteItems")
    await apiDelete(`${base}/${resource.id}`)
}
