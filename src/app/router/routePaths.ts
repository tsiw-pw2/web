export const routePaths = {
	dashboard: "/dashboard",
	campaigns: "/campanhas",
	beaches: "/praias",
	waste: "/residuos",
	settings: "/definicoes",
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
