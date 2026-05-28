import { describe, expect, it } from "vitest"
import {
    effectiveProfileRole,
    profileIsAdmin,
    profileIsOrganizerOrAdmin,
} from "@/modules/auth/lib/profileCapabilities"
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

describe("profileCapabilities", () => {
    it("uses role when present", () => {
        expect(effectiveProfileRole({ ...baseProfile, role: "admin" })).toBe("admin")
    })

    it("derives role from flags when role missing", () => {
        expect(
            effectiveProfileRole({
                ...baseProfile,
                role: undefined as unknown as SettingsProfile["role"],
                isAdmin: true,
            }),
        ).toBe("admin")
    })

    it("profileIsAdmin follows effective role not stale isAdmin flag alone", () => {
        expect(profileIsAdmin({ ...baseProfile, role: "volunteer", isAdmin: true })).toBe(false)
        expect(profileIsAdmin({ ...baseProfile, role: "admin", isAdmin: false })).toBe(true)
    })

    it("profileIsOrganizerOrAdmin", () => {
        expect(profileIsOrganizerOrAdmin({ ...baseProfile, role: "organizer" })).toBe(true)
        expect(profileIsOrganizerOrAdmin({ ...baseProfile, role: "volunteer" })).toBe(false)
    })
})
