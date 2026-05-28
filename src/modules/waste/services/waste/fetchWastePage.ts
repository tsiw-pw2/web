import type { WasteListFilters, WasteListItem } from "@/modules/waste/types/list"
import type { PaginatedResult } from "@/types/pagination"
import { unwrapList } from "@/infrastructure/hateoas"
import { requestApiData } from "@/infrastructure/request"

function appendFilters(q: URLSearchParams, filters?: WasteListFilters) {
    if (!filters) return
    if (filters.q) {
        q.set("q", filters.q)
    }
    if (filters.categories?.length) {
        for (const categoryId of filters.categories) {
            q.append("category", categoryId)
        }
    }
    if (filters.unit?.length) {
        for (const unit of filters.unit) {
            q.append("unit", unit)
        }
    }
}

export async function fetchWastePage(
    page: number,
    pageSize: number,
    filters?: WasteListFilters,
): Promise<PaginatedResult<WasteListItem>> {
    const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    })
    appendFilters(q, filters)
    const body = await requestApiData<unknown>(`/waste-items?${q}`, { method: "GET" })
    return unwrapList<WasteListItem>(body)
}
