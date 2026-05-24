import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { settingsUserRoleFromFlags, settingsUserRoleLabel } from "@/modules/settings/lib/settingsUserRole"

export function userRoleLabel(u: Pick<SettingsUserRow, "isAdmin" | "isOrganizer" | "role">): string {
    if (u.role) return settingsUserRoleLabel(u.role)
    return settingsUserRoleLabel(settingsUserRoleFromFlags(u))
}
