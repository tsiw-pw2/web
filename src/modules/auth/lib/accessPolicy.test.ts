import { describe, expect, it } from "vitest"
import {
    canAccessDashboard,
    canAccessMunicipalCatalog,
    canAccessSettingsOrgAdmin,
    canAccessSettingsOrganizations,
    canAccessSettingsWasteCategories,
    defaultAuthedRouteName,
    isPathAllowedForProfile,
} from "@/modules/auth/lib/accessPolicy"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const baseProfile: SettingsProfile = {
    id: "u1",
    name: "Test",
    email: "t@example.com",
    phone: null,
    avatarUrl: null,
    birthDate: null,
    role: "volunteer",
    isAdmin: false,
    isOrganizer: false,
    isBlocked: false,
    blockedReason: null,
    blockedAt: null,
}

describe("accessPolicy dashboard", () => {
    it("voluntário não acede ao dashboard", () => {
        expect(canAccessDashboard({ ...baseProfile, role: "volunteer" })).toBe(false)
        expect(defaultAuthedRouteName({ ...baseProfile, role: "volunteer" })).toBe("campaigns")
        expect(isPathAllowedForProfile("/dashboard", { ...baseProfile, role: "volunteer" })).toBe(false)
    })

    it("organizador e admin da org acedem ao dashboard", () => {
        expect(canAccessDashboard({ ...baseProfile, role: "organizer", isOrganizer: true })).toBe(true)
        expect(
            canAccessDashboard({ ...baseProfile, role: "orgAdmin", isOrganizer: true, isOrgAdmin: true }),
        ).toBe(true)
        expect(defaultAuthedRouteName({ ...baseProfile, role: "organizer", isOrganizer: true })).toBe(
            "dashboard",
        )
    })

    it("root não acede ao dashboard e vai para campanhas", () => {
        expect(canAccessDashboard({ ...baseProfile, isRoot: true, role: "volunteer" })).toBe(false)
        expect(defaultAuthedRouteName({ ...baseProfile, isRoot: true })).toBe("campaigns")
    })

    it("perfil em falta não acede ao dashboard", () => {
        expect(canAccessDashboard(null)).toBe(false)
        expect(canAccessDashboard(undefined)).toBe(false)
    })
})

describe("accessPolicy municipal catalog", () => {
    it("root e voluntário não acedem a praias/resíduos", () => {
        expect(canAccessMunicipalCatalog({ ...baseProfile, isRoot: true })).toBe(false)
        expect(canAccessMunicipalCatalog({ ...baseProfile, role: "volunteer" })).toBe(false)
        expect(isPathAllowedForProfile("/praias", { ...baseProfile, isRoot: true })).toBe(false)
        expect(isPathAllowedForProfile("/residuos", { ...baseProfile, isRoot: true })).toBe(false)
    })

    it("staff municipal acede ao catálogo", () => {
        expect(canAccessMunicipalCatalog({ ...baseProfile, role: "organizer", isOrganizer: true })).toBe(
            true,
        )
    })
})

describe("accessPolicy settings", () => {
    it("só admin da org acede à equipa", () => {
        expect(canAccessSettingsOrgAdmin({ ...baseProfile, isOrgAdmin: true, isOrganizer: true })).toBe(
            true,
        )
        expect(canAccessSettingsOrgAdmin({ ...baseProfile, isOrganizer: true })).toBe(false)
    })

    it("só root acede a organizações", () => {
        expect(canAccessSettingsOrganizations({ ...baseProfile, isRoot: true })).toBe(true)
        expect(canAccessSettingsOrganizations({ ...baseProfile, isOrgAdmin: true })).toBe(false)
        expect(
            isPathAllowedForProfile("/definicoes/organizacoes", { ...baseProfile, isOrgAdmin: true }),
        ).toBe(false)
    })

    it("root não acede a categorias; admin da org sim", () => {
        expect(canAccessSettingsWasteCategories({ ...baseProfile, isRoot: true })).toBe(false)
        expect(
            isPathAllowedForProfile("/definicoes/categorias-residuos", { ...baseProfile, isRoot: true }),
        ).toBe(false)
        expect(
            canAccessSettingsWasteCategories({
                ...baseProfile,
                isOrgAdmin: true,
                isOrganizer: true,
            }),
        ).toBe(true)
        expect(
            isPathAllowedForProfile("/definicoes/categorias-residuos", {
                ...baseProfile,
                isOrgAdmin: true,
                isOrganizer: true,
            }),
        ).toBe(true)
    })
})
