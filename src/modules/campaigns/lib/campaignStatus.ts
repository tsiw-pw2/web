export const CAMPAIGN_STATUS_KEYS = [
    "planeada",
    "aberta_inscricoes",
    "encerrada_inscricoes",
    "em_progresso",
    "concluida",
    "cancelada",
] as const

export type CampaignStatusKey = (typeof CAMPAIGN_STATUS_KEYS)[number]

const CAMPAIGN_STATUS_LABELS: Record<CampaignStatusKey, string> = {
    planeada: "Planeada",
    aberta_inscricoes: "Aberta a inscrições",
    encerrada_inscricoes: "Inscrições encerradas",
    em_progresso: "Em progresso",
    concluida: "Concluída",
    cancelada: "Cancelada",
}

export const CAMPAIGN_STATUS_SELECT_OPTIONS = CAMPAIGN_STATUS_KEYS.map((value) => ({
    value,
    label: CAMPAIGN_STATUS_LABELS[value],
}))

export const CAMPAIGN_CREATE_STATUS_KEYS = ["planeada", "aberta_inscricoes"] as const satisfies readonly CampaignStatusKey[]

export type CampaignCreateStatusKey = (typeof CAMPAIGN_CREATE_STATUS_KEYS)[number]

export const CAMPAIGN_CREATE_DEFAULT_STATUS: CampaignCreateStatusKey = "planeada"

export const CAMPAIGN_CREATE_STATUS_SELECT_OPTIONS = CAMPAIGN_CREATE_STATUS_KEYS.map((value) => ({
    value,
    label: CAMPAIGN_STATUS_LABELS[value],
}))

// Devolve o rótulo legível do estado da campanha.
export function campaignStatusLabel(key: CampaignStatusKey | string | undefined | null): string {
    if (!key) return "-"
    return CAMPAIGN_STATUS_LABELS[key as CampaignStatusKey] ?? "-"
}

export const ENROLLABLE_CAMPAIGN_STATUS_KEYS = new Set<CampaignStatusKey>([
    "aberta_inscricoes",
])

const ENROLLMENT_CLOSED_STATUS_KEYS = new Set<CampaignStatusKey>([
    "planeada",
    "encerrada_inscricoes",
    "em_progresso",
    "concluida",
    "cancelada",
])

// Indica se inscrição fechada estado.
export function isEnrollmentClosedStatus(key: CampaignStatusKey): boolean {
    return ENROLLMENT_CLOSED_STATUS_KEYS.has(key)
}

export const CAMPAIGN_TERMINAL_STATUS_KEYS = new Set<CampaignStatusKey>(["concluida", "cancelada"])

// Campanha concluída ou cancelada: sem alterações a inscrições ou recolhas.
export function isCampaignTerminalStatus(key: CampaignStatusKey | string | undefined | null): boolean {
    if (!key) return false
    return CAMPAIGN_TERMINAL_STATUS_KEYS.has(key as CampaignStatusKey)
}
