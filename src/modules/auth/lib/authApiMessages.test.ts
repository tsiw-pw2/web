import { describe, expect, it } from "vitest"
import { mapAuthApiMessage } from "@/modules/auth/lib/authApiMessages"

describe("mapAuthApiMessage", () => {
    it("traduz Validation failed para português", () => {
        expect(mapAuthApiMessage("Validation failed", "fallback")).toBe(
            "Preenche os campos obrigatórios.",
        )
    })

    it("devolve fallback para mensagem desconhecida", () => {
        expect(mapAuthApiMessage("Unknown server error", "Erro genérico")).toBe("Erro genérico")
    })

    it("devolve fallback para string vazia", () => {
        expect(mapAuthApiMessage("", "Erro genérico")).toBe("Erro genérico")
    })
})
