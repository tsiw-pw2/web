export type SettingsProfile = {
    id: string
    name: string
    email: string
    phone: string | null
    avatarUrl: string | null
    isAdmin: boolean
    isOrganizer: boolean
    isBlocked: boolean
}
