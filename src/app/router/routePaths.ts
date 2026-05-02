export const routePaths = {
	home: "/",
	requestAccount: "/solicitar-acesso",
	login: "/entrar",
	dashboard: "/dashboard",
	campaigns: "/campanhas",
	campaignDetails: "/campanhas/:campaignId",
	beaches: "/praias",
	waste: "/residuos",
	settings: "/definicoes",
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
