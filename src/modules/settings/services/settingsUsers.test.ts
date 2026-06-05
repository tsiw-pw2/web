import { describe, expect, it } from "vitest"
import { shouldUseCachedUsersNextLink } from "@/modules/settings/services/settingsUsers"

describe("shouldUseCachedUsersNextLink", () => {
    it("rejeita next link quando o filtro role mudou", () => {
        expect(
            shouldUseCachedUsersNextLink({
                page: 2,
                roleFilter: "volunteer",
                lastFetchedRole: undefined,
                lastFetchedPage: 1,
                hasNextLink: true,
            }),
        ).toBe(false)
    })

    it("rejeita next link quando a página não é sequencial", () => {
        expect(
            shouldUseCachedUsersNextLink({
                page: 3,
                roleFilter: undefined,
                lastFetchedRole: undefined,
                lastFetchedPage: 1,
                hasNextLink: true,
            }),
        ).toBe(false)
    })

    it("aceita next link na página seguinte com o mesmo filtro", () => {
        expect(
            shouldUseCachedUsersNextLink({
                page: 2,
                roleFilter: "volunteer",
                lastFetchedRole: "volunteer",
                lastFetchedPage: 1,
                hasNextLink: true,
            }),
        ).toBe(true)
    })

    it("rejeita next link na primeira página", () => {
        expect(
            shouldUseCachedUsersNextLink({
                page: 1,
                roleFilter: "volunteer",
                lastFetchedRole: "volunteer",
                lastFetchedPage: 1,
                hasNextLink: true,
            }),
        ).toBe(false)
    })
})
