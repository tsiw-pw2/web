import { describe, expect, it } from "vitest"
import { canAccessCampaignComments } from "@/modules/campaigns/lib/canAccessCampaignComments"

describe("canAccessCampaignComments", () => {
    it("permite comentários só em campanha concluída com link hypermedia", () => {
        expect(
            canAccessCampaignComments({
                id: "c1",
                editStatus: "concluida",
                links: { comments: { href: "/campaigns/c1/comments", method: "GET" } },
            }),
        ).toBe(true)
    })

    it("bloqueia comentários antes da conclusão mesmo com link", () => {
        expect(
            canAccessCampaignComments({
                id: "c1",
                editStatus: "em_progresso",
                links: { comments: { href: "/campaigns/c1/comments", method: "GET" } },
            }),
        ).toBe(false)
    })

    it("bloqueia sem link hypermedia", () => {
        expect(
            canAccessCampaignComments({
                id: "c1",
                editStatus: "concluida",
                links: {},
            }),
        ).toBe(false)
    })
})
