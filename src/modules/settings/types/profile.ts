import type { SettingsUserRoleKey } from "@/modules/settings/lib/settingsUserRole"

export type SettingsOrganization = {
    id: string
    name: string
    municipality: string
}

export type SettingsProfile = {
    id: string
    name: string
    email: string
    phone: string | null
    avatarUrl: string | null
    birthDate: string | null
    role: SettingsUserRoleKey
    isAdmin: boolean
    isRoot?: boolean
    isOrgAdmin?: boolean
    isOrganizer: boolean
    isBlocked: boolean
    blockedReason: string | null
    blockedAt: string | null
    organizations?: SettingsOrganization[]
}
