import { afterEach, describe, expect, it } from "vitest"
import {
    accessToken,
    getAccessToken,
    hydrateAccessTokenFromSession,
    setAccessToken,
} from "@/infrastructure/access-token"

describe("access-token", () => {
    afterEach(() => {
        setAccessToken(null)
    })

    it("hydrateAccessTokenFromSession restaura token após simular F5", () => {
        setAccessToken("token-demo-123")
        accessToken.value = null
        expect(getAccessToken()).toBeNull()

        hydrateAccessTokenFromSession()
        expect(getAccessToken()).toBe("token-demo-123")
    })

    it("setAccessToken(null) limpa sessionStorage", () => {
        setAccessToken("token-demo-123")
        setAccessToken(null)
        hydrateAccessTokenFromSession()
        expect(getAccessToken()).toBeNull()
    })
})
