import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function updateWaste(id: string, draft: WasteUpsertDraft): Promise<WasteListItem> {
    return requestApiData<WasteListItem>(`/waste/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            category: draft.category,
            unit: draft.unit,
        }),
    })
}
