export type WasteUnitKey = "peso" | "unit"

export type WasteListFilters = {
    q?: string
    categories?: string[]
    unit?: WasteUnitKey[]
}

import type { ResourceLinks } from "@/infrastructure/hypermedia.types"

export type WasteListItem = {
    id: string
    name: string
    categoryId: string
    categoryName: string
    unit: string
    averageWeightGrams: number | null
    links?: ResourceLinks
}

export type WasteUpsertDraft = {
    name: string
    categoryId: string
    unit: string
    averageWeightGrams?: number | null
}
