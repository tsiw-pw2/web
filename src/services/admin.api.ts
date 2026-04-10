import { apiFetch } from "./http"

export type AdminDashboard = {
    campanhas_ativas: number
    inscricoes_confirmadas: number
    peso_total_kg: number
    recolhas_registadas: number
    utilizadores_total: number
    periodo: { from: string; to: string }
}

export async function fetchAdminDashboard() {
    return apiFetch<AdminDashboard>("/admin/dashboard")
}
