import { href } from "@/infrastructure/apiDiscovery"
import { apiGet } from "@/infrastructure/apiClient"
import type { DashboardOverview } from "@/modules/dashboard/types"

// Valida se o corpo da resposta corresponde ao formato do painel.
function isDashboardOverview(body: unknown): body is DashboardOverview {
    if (!body || typeof body !== "object") return false
    const record = body as Record<string, unknown>
    const metrics = record.metrics
    return metrics != null && typeof metrics === "object" && !Array.isArray(metrics)
}

// Obtém as métricas e dados do painel principal.
export async function getDashboardOverview(): Promise<DashboardOverview> {
    const body = await apiGet<unknown>(await href("dashboards"))
    if (!isDashboardOverview(body)) {
        throw new Error("Invalid dashboard response")
    }
    return body
}
