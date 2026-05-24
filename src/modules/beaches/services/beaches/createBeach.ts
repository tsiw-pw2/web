import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { unwrapResource } from "@/infrastructure/hateoas"
import { stringifyRecordStrings } from "@/infrastructure/jsonBody"
import { requestApiData } from "@/infrastructure/request"

export async function createBeach(draft: BeachUpsertDraft): Promise<BeachListItem> {
    const body = await requestApiData<unknown>("/beaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: stringifyRecordStrings({
            name: draft.name,
            municipality: draft.municipality,
            district: draft.district,
            latitude: draft.latitude,
            longitude: draft.longitude,
        }),
    })
    return unwrapResource<BeachListItem>(body)
}
