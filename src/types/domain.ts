export type CampanhaEstado = 0 | 1 | 2 | 3 | 4 | 5

export const campanhaEstadoLabel: Record<CampanhaEstado, string> = {
    0: "Planeada",
    1: "Aberta a inscrições",
    2: "Inscrições encerradas",
    3: "Em progresso",
    4: "Concluída",
    5: "Cancelada",
}

export interface Campaign {
    id: string
    title: string
    description: string
    meetingLocation: string
    meetingTime: string | null
    startDate: string
    endDate: string
    estado: CampanhaEstado
    organizerId: string
    beachIds: string[]
}

export type CampaignDraft = Omit<Campaign, "id">

export interface BeachLocation {
    id: string
    distrito: string
    concelho: string
    freguesia: string
    codigoNuts: string
}

export interface Beach {
    id: string
    locationId: string
    createdByUserId: string
    name: string
    latitude: number
    longitude: number
    description: string
}

export interface BeachFormValues {
    distrito: string
    concelho: string
    freguesia: string
    codigoNuts: string
    name: string
    latitude: number
    longitude: number
    description: string
}

export interface TipoResiduo {
    id: string
    nome: string
}

export type TipoResiduoDraft = Omit<TipoResiduo, "id">

export interface Residuo {
    id: string
    tipoResiduoId: string
    nome: string
    pesoMedioGramas: number | null
}

export type ResiduoDraft = Omit<Residuo, "id">

export interface RecolhaResiduo {
    id: string
    campaignId: string
    beachId: string
    residuoId: string
    registeredByUserId: string
    quantidadeUnidades: number
    pesoRealKg: number | null
}

export type RecolhaResiduoDraft = Omit<RecolhaResiduo, "id">

export type InscricaoFuncao = 0 | 1
export type InscricaoEstado = 0 | 1 | 2

export const inscricaoFuncaoLabel: Record<InscricaoFuncao, string> = {
    0: "Voluntário",
    1: "Organizador",
}

export const inscricaoEstadoLabel: Record<InscricaoEstado, string> = {
    0: "Pendente",
    1: "Confirmada",
    2: "Cancelada",
}

export interface Inscricao {
    id: string
    campaignId: string
    userId: string
    funcao: InscricaoFuncao
    estado: InscricaoEstado
    presenca: boolean | null
}

export type InscricaoDraft = Omit<Inscricao, "id">

export interface ComentarioCampanha {
    id: string
    campaignId: string
    userId: string
    texto: string
    isVisible: boolean
    autorNome?: string
}

export type ComentarioCampanhaDraft = Omit<ComentarioCampanha, "id">
