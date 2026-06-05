import { describe, expect, it } from "vitest"
import {
    beachListFilterQuerySignature,
    parseBeachListSearch,
    readBeachListFiltersFromQuery,
} from "@/modules/beaches/lib/beachListFiltersQuery"

describe("readBeachListFiltersFromQuery", () => {
    it("returns empty filters for empty query", () => {
        expect(readBeachListFiltersFromQuery({})).toEqual({})
    })

    it("parses q search term", () => {
        expect(readBeachListFiltersFromQuery({ q: "  Cascais  " })).toEqual({ q: "Cascais" })
    })

    it("truncates long search", () => {
        const long = "a".repeat(150)
        const result = readBeachListFiltersFromQuery({ q: long })
        expect(result.q?.length).toBe(100)
    })

    it("ignores empty q", () => {
        expect(readBeachListFiltersFromQuery({ q: "   " })).toEqual({})
    })
})

describe("parseBeachListSearch", () => {
    it("returns empty string for non-string input", () => {
        expect(parseBeachListSearch(42)).toBe("")
        expect(parseBeachListSearch(undefined)).toBe("")
    })
})

describe("beachListFilterQuerySignature", () => {
    it("is stable for equivalent queries", () => {
        expect(beachListFilterQuerySignature({ q: "costa" })).toBe(
            beachListFilterQuerySignature({ q: "  costa  " }),
        )
    })
})
