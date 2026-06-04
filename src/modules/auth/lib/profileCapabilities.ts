import type { SettingsProfile } from "@/modules/settings/types/profile"
import { settingsUserRoleFromFlags, type SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"

// Obtém perfil papel efectivo.
export function effectiveProfileRole(profile: SettingsProfile | null | undefined): SettingsUserRoleKey | null {
    if (!profile) return null
    if (profile.role) return profile.role
    return settingsUserRoleFromFlags(profile)
}

// Avalia is administrador do perfil.
export function profileIsAdmin(profile: SettingsProfile | null | undefined): boolean {
    return effectiveProfileRole(profile) === "admin"
}

// Avalia is organizer ou administrador do perfil.
export function profileIsOrganizerOrAdmin(profile: SettingsProfile | null | undefined): boolean {
    const role = effectiveProfileRole(profile)
    return role === "admin" || role === "organizer"
}
