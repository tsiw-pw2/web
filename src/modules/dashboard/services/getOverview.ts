import { requestApiData } from "@/infrastructure/request"
import type { DashboardOverview } from "../types"

export async function getDashboardOverview(): Promise<DashboardOverview> {
    return requestApiData<DashboardOverview>("/dashboard/overview", {
        method: "GET",
    })
}
