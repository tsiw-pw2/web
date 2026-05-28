import { describe, expect, it } from "vitest"
import { isWeightGramsInputValid, parseWeightGramsInput } from "@/modules/waste/lib/wasteWeightForm"

describe("parseWeightGramsInput", () => {
    it("parses valid string grams", () => {
        expect(parseWeightGramsInput("250")).toBe(250)
        expect(parseWeightGramsInput(" 1 ")).toBe(1)
    })

    it("parses valid number grams", () => {
        expect(parseWeightGramsInput(250)).toBe(250)
    })

    it("rejects empty or invalid values", () => {
        expect(parseWeightGramsInput("")).toBeNull()
        expect(parseWeightGramsInput(null)).toBeNull()
        expect(parseWeightGramsInput(undefined)).toBeNull()
        expect(parseWeightGramsInput("0")).toBeNull()
        expect(parseWeightGramsInput("abc")).toBeNull()
    })
})

describe("isWeightGramsInputValid", () => {
    it("returns true for minimum valid gram", () => {
        expect(isWeightGramsInputValid("1")).toBe(true)
        expect(isWeightGramsInputValid(1)).toBe(true)
    })

    it("returns false for invalid input", () => {
        expect(isWeightGramsInputValid("")).toBe(false)
        expect(isWeightGramsInputValid("0")).toBe(false)
    })
})
