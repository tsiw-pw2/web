export const SETTINGS_USER_DETAILS_TABS = [
    { id: "informacao", label: "Informação" },
    { id: "participacoes", label: "Participações" },
    { id: "organizadas", label: "Campanhas organizadas" },
] as const

export type SettingsUserDetailsTabId = (typeof SETTINGS_USER_DETAILS_TABS)[number]["id"]

export const DEFAULT_SETTINGS_USER_DETAILS_TAB: SettingsUserDetailsTabId = "informacao"

// Indica se definições utilizador detalhes separador identificador.
export function isSettingsUserDetailsTabId(value: unknown): value is SettingsUserDetailsTabId {
    return SETTINGS_USER_DETAILS_TABS.some((tab) => tab.id === value)
}

// Função de definições que trata utilizador detalhes separador de rota.
export function settingsUserDetailsTabFromRoute(value: unknown): SettingsUserDetailsTabId {
    if (isSettingsUserDetailsTabId(value)) {
        return value
    }
    return DEFAULT_SETTINGS_USER_DETAILS_TAB
}
