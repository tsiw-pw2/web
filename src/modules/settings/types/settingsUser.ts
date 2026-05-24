import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"

export type SettingsUserRow = {
    id: string
    name: string
    email: string
    phone: string | null
    birthDate: string | null
    avatarUrl: string | null
    role: SettingsUserRoleKey
    isAdmin: boolean
    isOrganizer: boolean
    isBlocked: boolean
    blockedReason: string | null
    blockedAt: string | null
    createdAt: string | null
}
