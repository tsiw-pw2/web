import { apiFetch, apiJson } from "./http"
import type { ApiBeachRow } from "../lib/apiMappers"

export async function fetchBeachesList(page = 1, limit = 200) {
    return apiFetch<{ data: ApiBeachRow[]; meta: { page: number; limit: number; total: number } }>(
        `/beaches?page=${page}&limit=${limit}`,
    )
}

export async function postAdminLocation(body: {
    distrito: string
    concelho: string
    freguesia: string
    codigo_nuts: string
}) {
    return apiJson<{ id: string }>("/admin/locations", "POST", body)
}

export async function postAdminBeach(body: {
    localizacao_praia_id: string
    nome: string
    latitude: number
    longitude: number
    descricao?: string | null
}) {
    return apiJson<ApiBeachRow>("/admin/beaches", "POST", body)
}

export async function patchAdminBeach(id: string, body: Record<string, unknown>) {
    return apiJson<ApiBeachRow>(`/admin/beaches/${id}`, "PATCH", body)
}
