import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { ref } from "vue"

function seedUsers(): SettingsUserRow[] {
	return [
		{
			id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
			name: "Maria Silva",
			email: "maria@exemplo.org",
			isAdmin: true,
			isOrganizer: false,
			isBlocked: false,
			blockedReason: null,
			blockedAt: null,
		},
		{
			id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
			name: "João Costa",
			email: "joao@exemplo.org",
			isAdmin: false,
			isOrganizer: true,
			isBlocked: false,
			blockedReason: null,
			blockedAt: null,
		},
		{
			id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
			name: "Ana Ribeiro",
			email: "ana@exemplo.org",
			isAdmin: false,
			isOrganizer: false,
			isBlocked: true,
			blockedReason: "Comportamento inadequado durante uma campanha.",
			blockedAt: "2026-03-15T14:30:00.000Z",
		},
	]
}

const users = ref<SettingsUserRow[]>([])
let mockInitialized = false

function ensureSeed() {
	if (!mockInitialized) {
		users.value = seedUsers()
		mockInitialized = true
	}
}

ensureSeed()

export function blockUser(userId: string, reason: string) {
	const u = users.value.find((row) => row.id === userId)
	if (!u) return
	u.isBlocked = true
	u.blockedReason = reason.trim()
	u.blockedAt = new Date().toISOString()
}

export function unblockUser(userId: string) {
	const u = users.value.find((row) => row.id === userId)
	if (!u) return
	u.isBlocked = false
	u.blockedReason = null
	u.blockedAt = null
}

export { users as settingsUsersRef }
