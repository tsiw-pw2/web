export const routePaths = {
    home: "/",
    requestAccount: "/solicitar-acesso",
    login: "/entrar",
    componentShowcase: "/componentes",
    dashboard: "/dashboard",
    campaigns: "/campanhas",
    campaignDetails: "/campanhas/:campaignId/:tab",
    beaches: "/praias",
    waste: "/residuos",
    settings: "/definicoes",
    settingsProfile: "/definicoes/perfil",
    settingsUsers: "/definicoes/utilizadores",
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
