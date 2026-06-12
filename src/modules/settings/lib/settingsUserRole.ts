export type SettingsUserRoleKey = "volunteer" | "organizer" | "orgAdmin" | "root"

export const SETTINGS_USER_ROLE_OPTIONS: { value: SettingsUserRoleKey; label: string }[] = [
    { value: "volunteer", label: "Voluntário" },
    { value: "organizer", label: "Organizador" },
    { value: "orgAdmin", label: "Admin da organização" },
    { value: "root", label: "Root da plataforma" },
]

export function settingsUserRoleLabel(role: SettingsUserRoleKey): string {
    return SETTINGS_USER_ROLE_OPTIONS.find((o) => o.value === role)?.label ?? "Voluntário"
}

export function settingsUserRoleFromFlags(u: {
    isRoot?: boolean
    isOrgAdmin?: boolean
    isAdmin?: boolean
    isOrganizer: boolean
}): SettingsUserRoleKey {
    if (u.isRoot) return "root"
    if (u.isOrgAdmin) return "orgAdmin"
    if (u.isOrganizer) return "organizer"
    return "volunteer"
}
