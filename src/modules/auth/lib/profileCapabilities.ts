import type { SettingsProfile } from "@/modules/settings/types/profile"
import { settingsUserRoleFromFlags, type SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"

export function effectiveProfileRole(profile: SettingsProfile | null | undefined): SettingsUserRoleKey | null {
    if (!profile) return null
    if (profile.role) return profile.role
    return settingsUserRoleFromFlags(profile)
}

export function profileIsAdmin(profile: SettingsProfile | null | undefined): boolean {
    return effectiveProfileRole(profile) === "admin"
}

export function profileIsOrganizerOrAdmin(profile: SettingsProfile | null | undefined): boolean {
    const role = effectiveProfileRole(profile)
    return role === "admin" || role === "organizer"
}
