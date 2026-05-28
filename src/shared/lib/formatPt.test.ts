import { describe, expect, it } from "vitest"
import { formatDatePtDayMonthSlash } from "@/shared/lib/formatPt"

describe("formatDatePtDayMonthSlash", () => {
    it("formats ISO date as DD/MM", () => {
        expect(formatDatePtDayMonthSlash("2026-04-12")).toBe("12/04")
    })

    it("zero-pads single-digit day and month", () => {
        expect(formatDatePtDayMonthSlash("2026-09-05")).toBe("05/09")
    })

    it("formats API list date DD/MM/YYYY as DD/MM", () => {
        expect(formatDatePtDayMonthSlash("12/04/2026")).toBe("12/04")
    })

    it("returns em dash for invalid or empty input", () => {
        expect(formatDatePtDayMonthSlash("")).toBe("—")
        expect(formatDatePtDayMonthSlash("invalid")).toBe("—")
    })
})
