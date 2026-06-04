import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import { href } from "@/infrastructure/apiDiscovery"
import { followHref } from "@/infrastructure/hypermediaClient"

// Cria uma nova praia com os dados do rascunho.
export async function createBeach(draft: BeachUpsertDraft): Promise<BeachListItem> {
    const path = await href("beaches")
    return followHref<BeachListItem>(
        { href: path, method: "POST" },
        {
            method: "POST",
            body: {
                name: draft.name,
                municipality: draft.municipality,
                district: draft.district,
                latitude: draft.latitude,
                longitude: draft.longitude,
            },
        },
    )
}
