import { describe, expect, it } from "vitest"
import {
    effectiveProfileRole,
    profileIsOrgAdmin,
    profileIsOrganizerOrAdmin,
    profileIsRoot,
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
    it("effectiveProfileRole prioriza root e admin da org", () => {
        expect(effectiveProfileRole({ ...baseProfile, isRoot: true })).toBe("root")
        expect(
            effectiveProfileRole({ ...baseProfile, isOrgAdmin: true, isOrganizer: true, role: "organizer" }),
        ).toBe("orgAdmin")
        expect(effectiveProfileRole({ ...baseProfile, isOrganizer: true, role: "organizer" })).toBe(
            "organizer",
        )
    })

    it("profileIsRoot e profileIsOrgAdmin", () => {
        expect(profileIsRoot({ ...baseProfile, isRoot: true })).toBe(true)
        expect(profileIsOrgAdmin({ ...baseProfile, isOrgAdmin: true })).toBe(true)
        expect(profileIsOrganizerOrAdmin({ ...baseProfile, isOrganizer: true, role: "organizer" })).toBe(
            true,
        )
    })
})
