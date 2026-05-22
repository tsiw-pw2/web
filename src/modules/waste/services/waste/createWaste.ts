import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function createWaste(draft: WasteUpsertDraft): Promise<WasteListItem> {
    return requestApiData<WasteListItem>("/waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            category: draft.category,
            unit: draft.unit,
        }),
    })
}
