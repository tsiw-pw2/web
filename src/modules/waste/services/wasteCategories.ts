import type { WasteCategory, WasteCategoryUpsertDraft } from "@/modules/waste/types/wasteCategory"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { unwrapList, unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

export async function fetchWasteCategories(page = 1, pageSize = 100) {
    const body = await requestApiData<unknown>(`/waste-categories?page=${page}&pageSize=${pageSize}`)
    return unwrapList<WasteCategory>(body)
}

export async function createWasteCategory(draft: WasteCategoryUpsertDraft): Promise<WasteCategory> {
    const body = await requestApiData<unknown>("/waste-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({ name: draft.name }),
    })
    return unwrapResource<WasteCategory>(body)
}

export async function updateWasteCategory(id: string, draft: WasteCategoryUpsertDraft): Promise<WasteCategory> {
    const body = await requestApiData<unknown>(`/waste-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({ name: draft.name }),
    })
    return unwrapResource<WasteCategory>(body)
}

export async function deleteWasteCategory(id: string): Promise<void> {
    await requestApiData<null>(`/waste-categories/${id}`, { method: "DELETE" })
}
