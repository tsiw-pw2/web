export const SETTINGS_USERS_LIST_ROLE_VOLUNTEER = "volunteer" as const

export type SettingsUsersListRoleFilter = typeof SETTINGS_USERS_LIST_ROLE_VOLUNTEER

export type ParsedUsersListRoleQuery =
    | { filter: SettingsUsersListRoleFilter; invalid: false }
    | { filter: undefined; invalid: false }
    | { filter: undefined; invalid: true; raw: string }

/** Interpreta o parâmetro role da listagem admin de utilizadores. */
export function parseUsersListRoleQuery(raw: unknown): ParsedUsersListRoleQuery {
    if (raw == null || raw === "") {
        return { filter: undefined, invalid: false }
    }
    const s = Array.isArray(raw) ? raw[0] : raw
    if (typeof s !== "string" || s.trim() === "") {
        return { filter: undefined, invalid: false }
    }
    if (s === SETTINGS_USERS_LIST_ROLE_VOLUNTEER) {
        return { filter: SETTINGS_USERS_LIST_ROLE_VOLUNTEER, invalid: false }
    }
    return { filter: undefined, invalid: true, raw: s }
}
