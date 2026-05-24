import { describe, expect, it } from "vitest"
import { formatRecolhaWeightGrams } from "@/modules/campaigns/lib/recolhaDisplay"

describe("formatRecolhaWeightGrams", () => {
    it("formats actual weight in grams", () => {
        expect(formatRecolhaWeightGrams("1.5", null)).toEqual({
            text: "1500",
            isEstimated: false,
        })
    })

    it("formats estimated weight with tilde", () => {
        expect(formatRecolhaWeightGrams(null, "0.25")).toEqual({
            text: "~250",
            isEstimated: true,
        })
    })

    it("prefers actual over estimated", () => {
        expect(formatRecolhaWeightGrams("1", "2")).toEqual({
            text: "1000",
            isEstimated: false,
        })
    })

    it("returns null when no valid weight", () => {
        expect(formatRecolhaWeightGrams(null, null)).toBeNull()
        expect(formatRecolhaWeightGrams("-1", null)).toBeNull()
    })
})
