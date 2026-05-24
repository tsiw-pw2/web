export type WasteUnitKey = "peso" | "unit"

export type WasteListFilters = {
    q?: string
    category?: string
    unit?: WasteUnitKey[]
}

export type WasteListItem = {
    id: string
    name: string
    categoryId: string
    categoryName: string
    unit: string
    averageWeightGrams: number | null
}

export type WasteUpsertDraft = {
    name: string
    categoryId: string
    unit: string
    averageWeightGrams?: number | null
}
