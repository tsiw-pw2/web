import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import type { DashboardOverview } from "@/modules/dashboard/types"

function isDashboardOverview(body: unknown): body is DashboardOverview {
    if (!body || typeof body !== "object") return false
    const record = body as Record<string, unknown>
    const metrics = record.metrics
    return metrics != null && typeof metrics === "object" && !Array.isArray(metrics)
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
    const body = await requestApiData<unknown>("/dashboard", {
        method: "GET",
    })
    const unwrapped = unwrapResource<DashboardOverview>(body)
    if (!isDashboardOverview(unwrapped)) {
        throw new Error("Invalid dashboard response")
    }
    return unwrapped
}
