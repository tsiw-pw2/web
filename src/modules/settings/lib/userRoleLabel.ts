import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

export function userRoleLabel(u: Pick<SettingsUserRow, "isAdmin" | "isOrganizer">): string {
	const parts: string[] = []
	if (u.isAdmin) parts.push("Administrador")
	if (u.isOrganizer) parts.push("Organizador")
	if (parts.length === 0) parts.push("Participante")
	return parts.join(" · ")
}
