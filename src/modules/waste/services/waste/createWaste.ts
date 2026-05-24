import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

export async function createWaste(draft: WasteUpsertDraft): Promise<WasteListItem> {
    const body = await requestApiData<unknown>("/waste-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            categoryId: draft.categoryId,
            unit: draft.unit,
            averageWeightGrams:
                draft.unit === "peso" && draft.averageWeightGrams != null
                    ? String(draft.averageWeightGrams)
                    : "",
        }),
    })
    return unwrapResource<WasteListItem>(body)
}
