import { describe, expect, it } from "vitest"
import { parseUsersListRoleQuery } from "@/modules/settings/lib/settingsUsersListRoleQuery"

describe("parseUsersListRoleQuery", () => {
    it("aceita volunteer", () => {
        expect(parseUsersListRoleQuery("volunteer")).toEqual({
            filter: "volunteer",
            invalid: false,
        })
    })

    it("trata ausência de filtro", () => {
        expect(parseUsersListRoleQuery(undefined)).toEqual({ filter: undefined, invalid: false })
        expect(parseUsersListRoleQuery("")).toEqual({ filter: undefined, invalid: false })
    })

    it("rejeita cargo desconhecido", () => {
        expect(parseUsersListRoleQuery("volunteersss")).toEqual({
            filter: undefined,
            invalid: true,
            raw: "volunteersss",
        })
    })
})
