import { describe, expect, it } from "vitest"
import { formatPageTitle } from "@/app/lib/pageTitle"

describe("formatPageTitle", () => {
    it("returns app name when segment is empty", () => {
        expect(formatPageTitle("")).toMatch(/Mariva|App/)
        expect(formatPageTitle(undefined)).toMatch(/Mariva|App/)
    })

    it("joins segment and app name", () => {
        expect(formatPageTitle("Campanhas")).toBe("Campanhas · Mariva")
    })

    it("trims segment whitespace", () => {
        expect(formatPageTitle("  Praias  ")).toBe("Praias · Mariva")
    })
})
