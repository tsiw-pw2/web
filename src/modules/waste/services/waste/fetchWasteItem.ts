import type { WasteListItem } from "@/modules/waste/types/list"
import { href } from "@/infrastructure/apiDiscovery"
import { apiGet } from "@/infrastructure/apiClient"

// Obtém um item de resíduo pelo identificador.
export async function fetchWasteItem(id: string): Promise<WasteListItem> {
    const base = await href("wasteItems")
    return apiGet<WasteListItem>(`${base}/${id}`)
}
