import { describe, expect, it } from "vitest"
import { viewerRegistrationBelongsToProfile } from "@/modules/campaigns/lib/viewerRegistrationOwnership"

describe("viewerRegistrationBelongsToProfile", () => {
    it("só aceita inscrição do utilizador autenticado", () => {
        const reg = { id: "r1", userId: "u1", role: 0, status: 1, attendance: null }
        expect(viewerRegistrationBelongsToProfile(reg, { id: "u1" })).toBe(true)
        expect(viewerRegistrationBelongsToProfile(reg, { id: "u2" })).toBe(false)
        expect(viewerRegistrationBelongsToProfile(reg, null)).toBe(false)
        expect(viewerRegistrationBelongsToProfile(null, { id: "u1" })).toBe(false)
    })
})
