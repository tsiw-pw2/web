import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { href } from "@/infrastructure/apiDiscovery"
import { followHref } from "@/infrastructure/hypermediaClient"

// Cria um novo item de resíduo com os dados do rascunho.
export async function createWaste(draft: WasteUpsertDraft): Promise<WasteListItem> {
    const path = await href("wasteItems")
    return followHref<WasteListItem>(
        { href: path, method: "POST" },
        {
            method: "POST",
            body: {
                name: draft.name,
                categoryId: draft.categoryId,
                unit: draft.unit,
                averageWeightGrams:
                    draft.unit === "peso" && draft.averageWeightGrams != null
                        ? String(draft.averageWeightGrams)
                        : "",
            },
        },
    )
}
