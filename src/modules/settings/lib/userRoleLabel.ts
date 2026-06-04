import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { settingsUserRoleFromFlags, settingsUserRoleLabel } from "@/modules/settings/lib/settingsUserRole"

// Composable que gere a lógica de r papel rótulo.
export function userRoleLabel(u: Pick<SettingsUserRow, "isAdmin" | "isOrganizer" | "role">): string {
    if (u.role) return settingsUserRoleLabel(u.role)
    return settingsUserRoleLabel(settingsUserRoleFromFlags(u))
}
