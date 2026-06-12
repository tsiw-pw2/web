import type { SettingsProfile } from "@/modules/settings/types/profile"
import { settingsUserRoleFromFlags, type SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"

export function effectiveProfileRole(profile: SettingsProfile | null | undefined): SettingsUserRoleKey | null {
    if (!profile) return null
    if (profile.isRoot) return "root"
    if (profile.isOrgAdmin) return "orgAdmin"
    if (profile.role) return profile.role
    return settingsUserRoleFromFlags(profile)
}

export function profileIsRoot(profile: SettingsProfile | null | undefined): boolean {
    return profile?.isRoot === true
}

export function profileIsOrgAdmin(profile: SettingsProfile | null | undefined): boolean {
    return profile?.isOrgAdmin === true
}

export function profileIsOrganizerOrAdmin(profile: SettingsProfile | null | undefined): boolean {
    const role = effectiveProfileRole(profile)
    return role === "orgAdmin" || role === "organizer"
}

export function profileIsMunicipalStaff(profile: SettingsProfile | null | undefined): boolean {
    const role = effectiveProfileRole(profile)
    return role === "orgAdmin" || role === "organizer"
}
