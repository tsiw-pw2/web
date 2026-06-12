import { describe, expect, it } from "vitest"
import {
    cleanMunicipalityName,
    concelhoSelectOptionsForDistrict,
    districtSlugFromMunicipalityName,
} from "@/shared/lib/concelhosByDistrict"

describe("concelhosByDistrict", () => {
    it("remove sufixos [n] dos nomes de concelho", () => {
        expect(cleanMunicipalityName("Santo Tirso[2]")).toBe("Santo Tirso")
        expect(cleanMunicipalityName("Trofa[2]")).toBe("Trofa")
    })

    it("não expõe concelhos com sufixo [n] nas opções do distrito do Porto", () => {
        const options = concelhoSelectOptionsForDistrict("porto")
        const labels = options.map((option) => option.label)
        expect(labels).toContain("Santo Tirso")
        expect(labels).toContain("Trofa")
        expect(labels.some((label) => label.includes("["))).toBe(false)
    })

    it("resolve distrito a partir do concelho da organização", () => {
        expect(districtSlugFromMunicipalityName("Vila do Conde")).toBe("porto")
        expect(districtSlugFromMunicipalityName("Póvoa de Varzim")).toBe("porto")
    })
})
