import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function createBeach(draft: BeachUpsertDraft): Promise<BeachListItem> {
    return requestApiData<BeachListItem>("/beaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            municipality: draft.municipality,
            district: draft.district,
        }),
    })
}
