import { apiFetch, apiJson } from "./http"
import type { ApiCampaignDetail, ApiCampaignListItem } from "../lib/apiMappers"

export async function fetchCampaignsList(params?: Record<string, string | number | undefined>) {
    const q = new URLSearchParams()
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== "") q.set(k, String(v))
        }
    }
    const qs = q.toString()
    return apiFetch<{ data: ApiCampaignListItem[]; meta: { page: number; limit: number; total: number } }>(
        `/campaigns${qs ? `?${qs}` : ""}`,
    )
}

export async function fetchCampaignDetail(id: string) {
    return apiFetch<ApiCampaignDetail>(`/campaigns/${id}`)
}

export async function createCampaignApi(body: Record<string, unknown>) {
    return apiJson<unknown>("/campaigns", "POST", body)
}

export async function patchCampaignApi(id: string, body: Record<string, unknown>) {
    return apiJson<ApiCampaignDetail>(`/campaigns/${id}`, "PATCH", body)
}

export async function deleteCampaignApi(id: string) {
    return apiFetch<void>(`/campaigns/${id}`, { method: "DELETE" })
}

export async function putCampaignBeachesApi(id: string, beachIds: string[]) {
    return apiJson<{ campanha_id: string; associacoes: unknown[] }>(`/campaigns/${id}/beaches`, "PUT", {
        beach_ids: beachIds,
    })
}

export async function upsertRecolhaApi(campaignId: string, praiaId: string, body: Record<string, unknown>) {
    return apiJson<unknown>(`/campaigns/${campaignId}/beaches/${praiaId}/collections`, "PUT", body)
}

export async function fetchRegistrations(campaignId: string) {
    return apiFetch<{ data: unknown[] }>(`/campaigns/${campaignId}/registrations`)
}

export async function fetchRecolhasForCampaign(campaignId: string) {
    return apiFetch<{ data: unknown[] }>(`/campaigns/${campaignId}/recolhas`)
}

export async function postRegistrationApi(
    campaignId: string,
    body: Record<string, unknown>,
) {
    return apiJson<unknown>(`/campaigns/${campaignId}/registrations`, "POST", body)
}

export async function patchRegistrationApi(id: string, body: Record<string, unknown>) {
    return apiJson<unknown>(`/registrations/${id}`, "PATCH", body)
}

export async function deleteRecolhaApi(id: string) {
    return apiFetch<void>(`/recolhas/${id}`, { method: "DELETE" })
}

export async function fetchComments(campaignId: string, page = 1, limit = 100) {
    return apiFetch<{ data: unknown[]; meta: { page: number; total: number } }>(
        `/campaigns/${campaignId}/comments?page=${page}&limit=${limit}`,
    )
}

export async function postCommentApi(campaignId: string, comentario: string) {
    return apiJson<unknown>(`/campaigns/${campaignId}/comments`, "POST", { comentario })
}

export async function deleteCommentApi(id: string) {
    return apiFetch<void>(`/comments/${id}`, { method: "DELETE" })
}
