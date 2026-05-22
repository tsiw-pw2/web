import type { BeachListItem } from "@/modules/beaches/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { requestApiData } from "@/infrastructure/request"

export async function fetchBeachesPage(page: number, pageSize: number): Promise<PaginatedResult<BeachListItem>> {
    const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })
    return requestApiData<PaginatedResult<BeachListItem>>(`/beaches?${q}`, { method: "GET" })
}
