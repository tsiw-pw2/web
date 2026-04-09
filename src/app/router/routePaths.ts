export const routePaths = {
    dashboard: "/dashboard",
    campanhas: "/campanhas",
    praias: "/praias",
    residuos: "/residuos",
    definicoes: "/definicoes",
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
