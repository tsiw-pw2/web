import type { SettingsProfile } from "@/modules/settings/types/profile"
import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"
import {
    effectiveProfileRole,
    profileIsMunicipalStaff,
    profileIsOrgAdmin,
    profileIsRoot,
} from "@/modules/auth/lib/profileCapabilities"

export type AccessCapability =
    | "dashboard"
    | "settingsOrgAdmin"
    | "settingsOrganizations"
    | "settingsWasteCategories"
    | "municipalCatalog"

export function profileRole(profile: SettingsProfile | null | undefined): SettingsUserRoleKey | null {
    return effectiveProfileRole(profile)
}

export function canAccessDashboard(profile: SettingsProfile | null | undefined): boolean {
    if (profileIsRoot(profile)) return false
    return profileIsMunicipalStaff(profile)
}

export function canAccessMunicipalCatalog(profile: SettingsProfile | null | undefined): boolean {
    if (profileIsRoot(profile)) return false
    return profileIsMunicipalStaff(profile)
}

export function canAccessSettingsOrgAdmin(profile: SettingsProfile | null | undefined): boolean {
    return profileIsOrgAdmin(profile)
}

export function canAccessSettingsOrganizations(profile: SettingsProfile | null | undefined): boolean {
    return profileIsRoot(profile)
}

/** Categorias globais de resíduos — admin da org, não root. */
export function canAccessSettingsWasteCategories(profile: SettingsProfile | null | undefined): boolean {
    if (profileIsRoot(profile)) return false
    return profileIsOrgAdmin(profile)
}

export function profileHasCapability(
    profile: SettingsProfile | null | undefined,
    capability: AccessCapability,
): boolean {
    if (capability === "settingsOrganizations") {
        return canAccessSettingsOrganizations(profile)
    }
    if (capability === "settingsWasteCategories") {
        return canAccessSettingsWasteCategories(profile)
    }
    if (capability === "settingsOrgAdmin") {
        return canAccessSettingsOrgAdmin(profile)
    }
    if (capability === "municipalCatalog") {
        return canAccessMunicipalCatalog(profile)
    }
    if (capability === "dashboard") {
        return canAccessDashboard(profile)
    }
    return false
}

export function canManageCatalog(profile: SettingsProfile | null | undefined): boolean {
    return canAccessMunicipalCatalog(profile)
}

export function defaultAuthedRouteName(
    profile: SettingsProfile | null | undefined,
): "dashboard" | "campaigns" {
    return canAccessDashboard(profile) ? "dashboard" : "campaigns"
}

const BLOCKED_PATH_PREFIXES: { prefix: string; capability: AccessCapability }[] = [
    { prefix: "/dashboard", capability: "dashboard" },
    { prefix: "/praias", capability: "municipalCatalog" },
    { prefix: "/residuos", capability: "municipalCatalog" },
    { prefix: "/definicoes/utilizadores", capability: "settingsOrgAdmin" },
    { prefix: "/definicoes/categorias-residuos", capability: "settingsWasteCategories" },
    { prefix: "/definicoes/organizacoes", capability: "settingsOrganizations" },
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

// Compatibilidade com código legado que ainda referencia settingsAdmin.
export function canAccessSettingsAdmin(profile: SettingsProfile | null | undefined): boolean {
    return canAccessSettingsOrgAdmin(profile) || canAccessSettingsOrganizations(profile)
}

/** @deprecated usar canAccessSettingsOrganizations */
export function canAccessSettingsRoot(profile: SettingsProfile | null | undefined): boolean {
    return canAccessSettingsOrganizations(profile)
}
