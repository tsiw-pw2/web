import { apiFetch, apiJson } from "./http"

export async function fetchWasteTypes(page = 1, limit = 200) {
    return apiFetch<{ data: { id: string; nome: string }[]; meta: { page: number; total: number } }>(
        `/waste-types?page=${page}&limit=${limit}`,
    )
}

export async function fetchWastes(page = 1, limit = 500, tipoResiduoId?: string) {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (tipoResiduoId) q.set("tipo_residuo_id", tipoResiduoId)
    return apiFetch<{
        data: { id: string; tipo_residuo_id: string; nome: string; peso_medio_gramas: number | null }[]
        meta: { page: number; total: number }
    }>(`/wastes?${q}`)
}

export async function postWasteTypeApi(nome: string) {
    return apiJson<{ id: string; nome: string }>("/waste-types", "POST", { nome })
}

export async function patchWasteTypeApi(id: string, body: Record<string, unknown>) {
    return apiJson<unknown>(`/waste-types/${id}`, "PATCH", body)
}

export async function postWasteApi(body: {
    tipo_residuo_id: string
    nome: string
    peso_medio_gramas?: number | null
}) {
    return apiJson<unknown>("/wastes", "POST", body)
}

export async function patchWasteApi(id: string, body: Record<string, unknown>) {
    return apiJson<unknown>(`/wastes/${id}`, "PATCH", body)
}
