import { describe, expect, it } from "vitest"
import { readCampaignListFiltersFromQuery } from "@/modules/campaigns/composables/campaigns-list/useCampaignsListFilters"

describe("readCampaignListFiltersFromQuery", () => {
    it("returns empty filters for empty query", () => {
        expect(readCampaignListFiltersFromQuery({})).toEqual({})
    })

    it("parses q and status", () => {
        expect(
            readCampaignListFiltersFromQuery({
                q: "  esposende ",
                status: ["em_progresso", "invalid", "aberta_inscricoes"],
            }),
        ).toEqual({
            q: "esposende",
            status: ["em_progresso", "aberta_inscricoes"],
        })
    })

    it("truncates long search", () => {
        const long = "z".repeat(150)
        const result = readCampaignListFiltersFromQuery({ q: long })
        expect(result.q?.length).toBe(100)
    })

})
