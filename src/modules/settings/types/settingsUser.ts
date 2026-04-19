export type SettingsUserRow = {
	id: string
	name: string
	email: string
	isAdmin: boolean
	isOrganizer: boolean
	isBlocked: boolean
	blockedReason: string | null
	blockedAt: string | null
}
