import { describe, expect, it } from "vitest"
import { canSelfEnrollInCampaign } from "@/modules/campaigns/lib/canSelfEnrollInCampaign"

describe("canSelfEnrollInCampaign", () => {
    it("só mostra inscrição quando a API confirma viewerCanEnroll", () => {
        expect(
            canSelfEnrollInCampaign({ viewerCanEnroll: true }, { isBlocked: false }),
        ).toBe(true)
        expect(
            canSelfEnrollInCampaign({ viewerCanEnroll: false }, { isBlocked: false }),
        ).toBe(false)
        expect(
            canSelfEnrollInCampaign({ viewerCanEnroll: true }, { isBlocked: true }),
        ).toBe(false)
        expect(canSelfEnrollInCampaign(null, { isBlocked: false })).toBe(false)
        expect(canSelfEnrollInCampaign({ viewerCanEnroll: true }, null)).toBe(false)
    })
})
