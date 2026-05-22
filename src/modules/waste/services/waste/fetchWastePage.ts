import type { WasteListItem } from "@/modules/waste/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { requestApiData } from "@/infrastructure/request"

export async function fetchWastePage(page: number, pageSize: number): Promise<PaginatedResult<WasteListItem>> {
    const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })
    return requestApiData<PaginatedResult<WasteListItem>>(`/waste?${q}`, { method: "GET" })
}
