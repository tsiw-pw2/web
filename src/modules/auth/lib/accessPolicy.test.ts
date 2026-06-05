import { describe, expect, it } from "vitest"
import {
    canAccessDashboard,
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

    it("organizador e admin acedem ao dashboard", () => {
        expect(canAccessDashboard({ ...baseProfile, role: "organizer", isOrganizer: true })).toBe(true)
        expect(canAccessDashboard({ ...baseProfile, role: "admin", isAdmin: true })).toBe(true)
        expect(defaultAuthedRouteName({ ...baseProfile, role: "organizer" })).toBe("dashboard")
    })

    it("perfil em falta não acede ao dashboard", () => {
        expect(canAccessDashboard(null)).toBe(false)
        expect(canAccessDashboard(undefined)).toBe(false)
    })
})
