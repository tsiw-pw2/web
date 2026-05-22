import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function updateBeach(id: string, draft: BeachUpsertDraft): Promise<BeachListItem> {
    return requestApiData<BeachListItem>(`/beaches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            municipality: draft.municipality,
            district: draft.district,
        }),
    })
}
