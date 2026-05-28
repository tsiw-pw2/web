import type { SettingsProfile } from "@/modules/settings/types/profile"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import { effectiveProfileRole, profileIsAdmin } from "@/modules/auth/lib/profileCapabilities"

export type AccessCapability = "dashboard" | "settingsAdmin"

const CAPABILITY_ROLES: Record<AccessCapability, ReadonlySet<SettingsUserRoleKey>> = {
    dashboard: new Set(["admin", "organizer"]),
    settingsAdmin: new Set(["admin"]),
}

export function profileRole(profile: SettingsProfile | null | undefined): SettingsUserRoleKey | null {
    return effectiveProfileRole(profile)
}

export function profileHasCapability(
    profile: SettingsProfile | null | undefined,
    capability: AccessCapability,
): boolean {
    const role = profileRole(profile)
    if (!role) return false
    return CAPABILITY_ROLES[capability].has(role)
}

export function canAccessDashboard(profile: SettingsProfile | null | undefined): boolean {
    return profileHasCapability(profile, "dashboard")
}

export function canAccessSettingsAdmin(profile: SettingsProfile | null | undefined): boolean {
    return profileIsAdmin(profile)
}

export function canManageCatalog(profile: SettingsProfile | null | undefined): boolean {
    const role = profileRole(profile)
    return role === "admin" || role === "organizer"
}

export function defaultAuthedRouteName(profile: SettingsProfile | null | undefined): "dashboard" | "campaigns" {
    return canAccessDashboard(profile) ? "dashboard" : "campaigns"
}

const BLOCKED_PATH_PREFIXES: { prefix: string; capability: AccessCapability }[] = [
    { prefix: "/dashboard", capability: "dashboard" },
    { prefix: "/definicoes/utilizadores", capability: "settingsAdmin" },
    { prefix: "/definicoes/categorias-residuos", capability: "settingsAdmin" },
]

export function isPathAllowedForProfile(path: string, profile: SettingsProfile | null | undefined): boolean {
    const pathOnly = path.split("?")[0] ?? path
    for (const rule of BLOCKED_PATH_PREFIXES) {
        if (pathOnly === rule.prefix || pathOnly.startsWith(`${rule.prefix}/`)) {
            return profileHasCapability(profile, rule.capability)
        }
    }
    return true
}
