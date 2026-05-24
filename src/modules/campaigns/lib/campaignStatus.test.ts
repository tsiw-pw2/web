import { describe, expect, it } from "vitest"
import { campaignStatusLabel } from "@/modules/campaigns/lib/campaignStatus"

describe("campaignStatusLabel", () => {
    it("returns label for known status", () => {
        expect(campaignStatusLabel("em_progresso")).toBe("Em progresso")
    })

    it("returns dash for unknown or empty", () => {
        expect(campaignStatusLabel(null)).toBe("—")
        expect(campaignStatusLabel("unknown")).toBe("—")
    })
})
