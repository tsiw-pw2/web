import { describe, expect, it } from "vitest"
import { readWasteListFiltersFromQuery } from "@/modules/waste/composables/waste-list/useWasteListFilters"

const CATEGORY_ID = "550e8400-e29b-41d4-a716-446655440000"

describe("readWasteListFiltersFromQuery", () => {
    it("returns empty filters for empty query", () => {
        expect(readWasteListFiltersFromQuery({})).toEqual({})
    })

    it("parses q, categories and unit", () => {
        expect(
            readWasteListFiltersFromQuery({
                q: "vidro",
                category: [CATEGORY_ID, "660e8400-e29b-41d4-a716-446655440001"],
                unit: ["peso", "unit"],
            }),
        ).toEqual({
            q: "vidro",
            categories: [CATEGORY_ID, "660e8400-e29b-41d4-a716-446655440001"],
            unit: ["peso", "unit"],
        })
    })

    it("normalizes kg unit alias", () => {
        expect(readWasteListFiltersFromQuery({ unit: "kg" })).toEqual({
            unit: ["peso"],
        })
    })

    it("truncates long search", () => {
        const long = "a".repeat(150)
        const result = readWasteListFiltersFromQuery({ q: long })
        expect(result.q?.length).toBe(100)
    })
})
