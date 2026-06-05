import { describe, expect, it } from "vitest"
import { shouldReloadRegistrationsListAfterChange } from "@/modules/campaigns/lib/shouldReloadRegistrationsListAfterChange"

describe("shouldReloadRegistrationsListAfterChange", () => {
    it("só recarrega listagem de inscrições para org/admin", () => {
        expect(shouldReloadRegistrationsListAfterChange(true)).toBe(true)
        expect(shouldReloadRegistrationsListAfterChange(false)).toBe(false)
    })
})
