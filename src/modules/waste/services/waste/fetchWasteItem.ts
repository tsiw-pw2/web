import type { WasteListItem } from "@/modules/waste/types/list"
import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

export async function fetchWasteItem(id: string): Promise<WasteListItem> {
    const body = await requestApiData<unknown>(`/waste-items/${id}`)
    return unwrapResource<WasteListItem>(body)
}
