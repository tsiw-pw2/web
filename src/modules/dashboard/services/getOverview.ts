import { unwrapResource } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"
import type { DashboardOverview } from "@/modules/dashboard/types"

export async function getDashboardOverview(): Promise<DashboardOverview> {
    const body = await requestApiData<unknown>("/dashboard", {
        method: "GET",
    })
    return unwrapResource<DashboardOverview>(body)
}
