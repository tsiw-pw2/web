import { describe, expect, it } from "vitest"
import {
    campaignStatusLabel,
    ENROLLABLE_CAMPAIGN_STATUS_KEYS,
    isEnrollmentClosedStatus,
} from "@/modules/campaigns/lib/campaignStatus"

describe("campaignStatusLabel", () => {
    it("returns label for known status", () => {
        expect(campaignStatusLabel("em_progresso")).toBe("Em progresso")
    })

    it("returns dash for unknown or empty", () => {
        expect(campaignStatusLabel(null)).toBe("-")
        expect(campaignStatusLabel("unknown")).toBe("-")
    })
})

describe("enrollment status keys", () => {
    it("só aberta_inscricoes é elegível para auto-inscrição", () => {
        expect(ENROLLABLE_CAMPAIGN_STATUS_KEYS.has("aberta_inscricoes")).toBe(true)
        expect(ENROLLABLE_CAMPAIGN_STATUS_KEYS.has("encerrada_inscricoes")).toBe(false)
    })

    it("encerrada_inscricoes conta como inscrições fechadas", () => {
        expect(isEnrollmentClosedStatus("encerrada_inscricoes")).toBe(true)
        expect(isEnrollmentClosedStatus("aberta_inscricoes")).toBe(false)
    })
})
