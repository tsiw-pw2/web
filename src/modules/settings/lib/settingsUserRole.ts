export type SettingsUserRoleKey = "volunteer" | "organizer" | "admin"

export const SETTINGS_USER_ROLE_OPTIONS: { value: SettingsUserRoleKey; label: string }[] = [
    { value: "volunteer", label: "Voluntário" },
    { value: "organizer", label: "Organizador" },
    { value: "admin", label: "Administrador" },
]

// Função de definições que trata utilizador papel rótulo.
export function settingsUserRoleLabel(role: SettingsUserRoleKey): string {
    return SETTINGS_USER_ROLE_OPTIONS.find((o) => o.value === role)?.label ?? "Voluntário"
}

// Função de definições que trata utilizador papel de sinalizadores.
export function settingsUserRoleFromFlags(u: { isAdmin: boolean; isOrganizer: boolean }): SettingsUserRoleKey {
    if (u.isAdmin) return "admin"
    if (u.isOrganizer) return "organizer"
    return "volunteer"
}
