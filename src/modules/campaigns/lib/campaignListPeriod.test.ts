import { describe, expect, it } from "vitest"
import { formatCampaignDurationLabel, formatCampaignPeriodTooltip } from "@/modules/campaigns/lib/campaignListPeriod"

describe("formatCampaignDurationLabel", () => {
    it("formats single day", () => {
        expect(formatCampaignDurationLabel("2026-04-12", "2026-04-12")).toBe("1 dia")
    })

    it("formats multiple days when not divisible by week", () => {
        expect(formatCampaignDurationLabel("2026-04-12", "2026-04-16")).toBe("5 dias")
        expect(formatCampaignDurationLabel("2026-04-12", "2026-04-21")).toBe("10 dias")
    })

    it("formats weeks when divisible by 7", () => {
        expect(formatCampaignDurationLabel("2026-04-12", "2026-04-18")).toBe("1 semana")
        expect(formatCampaignDurationLabel("2026-04-12", "2026-04-25")).toBe("2 semanas")
    })

    it("formats months when divisible by 30 and at least 28 days", () => {
        expect(formatCampaignDurationLabel("2026-01-01", "2026-01-30")).toBe("1 mês")
        expect(formatCampaignDurationLabel("2026-01-01", "2026-03-31")).toBe("3 meses")
    })

    it("returns dash for invalid dates", () => {
        expect(formatCampaignDurationLabel("", "")).toBe("-")
        expect(formatCampaignDurationLabel("2026-04-18", "2026-04-12")).toBe("-")
    })
})

describe("formatCampaignPeriodTooltip", () => {
    it("includes start and end with long pt dates", () => {
        const tooltip = formatCampaignPeriodTooltip("2026-04-12", "2026-04-18")
        expect(tooltip).toContain("Início:")
        expect(tooltip).toContain("Fim:")
        expect(tooltip).toMatch(/12\s+abril\s+2026/)
    })

    it("uses start date for end when end is empty", () => {
        const tooltip = formatCampaignPeriodTooltip("2026-04-12", "")
        expect(tooltip).toContain("Fim: 12 abril 2026")
    })
})
