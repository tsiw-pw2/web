export const routePaths = {
    home: "/",
    requestAccount: "/solicitar-acesso",
    login: "/entrar",
    register: "/registar",
    componentShowcase: "/componentes",
    dashboard: "/dashboard",
    campaigns: "/campanhas",
    campaignDetails: "/campanhas/:campaignId/:tab",
    beaches: "/praias",
    waste: "/residuos",
    settings: "/definicoes",
    settingsProfile: "/definicoes/perfil",
    settingsSecurity: "/definicoes/seguranca",
    settingsUsers: "/definicoes/utilizadores",
    settingsUserDetails: "/definicoes/utilizadores/:userId/:tab",
    settingsWasteCategories: "/definicoes/categorias-residuos",
    settingsOrganizations: "/definicoes/organizacoes",
    privacy: "/privacidade",
    terms: "/termos",
    help: "/ajuda",
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
