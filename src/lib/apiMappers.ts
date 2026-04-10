import type {
    Beach,
    BeachLocation,
    Campaign,
    CampaignDraft,
    CampanhaEstado,
    ComentarioCampanha,
    Inscricao,
    RecolhaResiduo,
    Residuo,
    TipoResiduo,
} from "../types/domain"

export type ApiCampaignListItem = {
    id: string
    titulo: string
    data_inicio: string
    data_fim: string
    estado: number
    local_encontro: string
    hora_encontro: string | null
    organizador_id: string
    praia_ids: string[]
}

export type ApiPraiaBrief = { id: string; nome: string; latitude: number; longitude: number }

export type ApiCampaignDetail = {
    id: string
    titulo: string
    descricao: string | null
    local_encontro: string
    hora_encontro: string | null
    data_inicio: string
    data_fim: string
    estado: number
    organizador_id: string
    created_at: string
    praias: ApiPraiaBrief[]
}

export function mapCampaignListItem(row: ApiCampaignListItem): Campaign {
    const ht = row.hora_encontro
    return {
        id: row.id,
        title: row.titulo,
        description: "",
        meetingLocation: row.local_encontro,
        meetingTime: ht && ht.length >= 5 ? ht.slice(0, 5) : ht,
        startDate: row.data_inicio,
        endDate: row.data_fim,
        estado: row.estado as CampanhaEstado,
        organizerId: row.organizador_id,
        beachIds: row.praia_ids ?? [],
    }
}

export function mapCampaignDetail(api: ApiCampaignDetail): Campaign {
    const ht = api.hora_encontro
    return {
        id: api.id,
        title: api.titulo,
        description: api.descricao ?? "",
        meetingLocation: api.local_encontro,
        meetingTime: ht && ht.length >= 5 ? ht.slice(0, 5) : ht,
        startDate: api.data_inicio,
        endDate: api.data_fim,
        estado: api.estado as CampanhaEstado,
        organizerId: api.organizador_id,
        beachIds: api.praias?.map((p) => p.id) ?? [],
    }
}

export function campaignDraftToApi(d: CampaignDraft) {
    return {
        titulo: d.title,
        descricao: d.description.trim() || null,
        local_encontro: d.meetingLocation,
        hora_encontro: d.meetingTime ? `${d.meetingTime}:00` : null,
        data_inicio: d.startDate,
        data_fim: d.endDate,
        estado: d.estado,
    }
}

export type ApiBeachRow = {
    id: string
    nome: string
    latitude: number
    longitude: number
    descricao: string | null
    localizacao_praia_id: string
    criado_por_utilizador_id: string
    localizacao: {
        id: string
        distrito: string
        concelho: string
        freguesia: string
        codigo_nuts: string
    }
}

export function mapBeachFromApi(api: ApiBeachRow): Beach {
    return {
        id: api.id,
        locationId: api.localizacao_praia_id,
        createdByUserId: api.criado_por_utilizador_id,
        name: api.nome,
        latitude: api.latitude,
        longitude: api.longitude,
        description: api.descricao ?? "",
    }
}

export function mapLocationFromBeachRow(api: ApiBeachRow): BeachLocation {
    const l = api.localizacao
    return {
        id: l.id,
        distrito: l.distrito,
        concelho: l.concelho,
        freguesia: l.freguesia,
        codigoNuts: l.codigo_nuts,
    }
}

export function mapTipoResiduo(api: { id: string; nome: string }): TipoResiduo {
    return { id: api.id, nome: api.nome }
}

export function mapResiduo(api: {
    id: string
    tipo_residuo_id: string
    nome: string
    peso_medio_gramas: number | null
}): Residuo {
    return {
        id: api.id,
        tipoResiduoId: api.tipo_residuo_id,
        nome: api.nome,
        pesoMedioGramas: api.peso_medio_gramas,
    }
}

export function mapInscricao(api: {
    id: string
    campanha_id: string
    utilizador_id: string
    funcao: number
    estado: number
    presenca: boolean | number | null
}): Inscricao {
    const pr = api.presenca
    const presenca = pr === null || pr === undefined ? null : Boolean(pr)
    return {
        id: api.id,
        campaignId: api.campanha_id,
        userId: api.utilizador_id,
        funcao: api.funcao as Inscricao["funcao"],
        estado: api.estado as Inscricao["estado"],
        presenca,
    }
}

export type ApiRecolhaRow = {
    id: string
    campanha_id: string
    praia_id: string
    residuo_id: string
    registado_por_utilizador_id: string
    quantidade_unidades: number
    peso_real_kg: number | null
}

export function mapRecolha(api: ApiRecolhaRow): RecolhaResiduo {
    return {
        id: api.id,
        campaignId: api.campanha_id,
        beachId: api.praia_id,
        residuoId: api.residuo_id,
        registeredByUserId: api.registado_por_utilizador_id,
        quantidadeUnidades: api.quantidade_unidades,
        pesoRealKg: api.peso_real_kg,
    }
}

export function mapComentario(api: {
    id: string
    campanha_id: string
    utilizador_id: string
    comentario: string
    is_visible: number
    autor_nome?: string
}): ComentarioCampanha {
    return {
        id: api.id,
        campaignId: api.campanha_id,
        userId: api.utilizador_id,
        texto: api.comentario,
        isVisible: Boolean(api.is_visible),
        autorNome: api.autor_nome,
    }
}
