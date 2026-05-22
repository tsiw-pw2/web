export const CAMPAIGN_DETAILS_TAB_IDS = [
    "informacoes",
    "praias",
    "voluntarios",
    "recolhas",
    "comentarios",
] as const

export type CampaignDetailsTabId = (typeof CAMPAIGN_DETAILS_TAB_IDS)[number]

export const DEFAULT_CAMPAIGN_DETAILS_TAB: CampaignDetailsTabId = "informacoes"

const TAB_ROUTE_ALIASES: Record<string, CampaignDetailsTabId> = {
    resumo: "informacoes",
}

export function isCampaignDetailsTabId(value: string): value is CampaignDetailsTabId {
    return (CAMPAIGN_DETAILS_TAB_IDS as readonly string[]).includes(value)
}

export function campaignDetailsTabFromRoute(
    tab: string | string[] | undefined,
): CampaignDetailsTabId {
    const raw = Array.isArray(tab) ? tab[0] : tab
    if (raw && TAB_ROUTE_ALIASES[raw]) return TAB_ROUTE_ALIASES[raw]
    if (raw && isCampaignDetailsTabId(raw)) return raw
    return DEFAULT_CAMPAIGN_DETAILS_TAB
}
