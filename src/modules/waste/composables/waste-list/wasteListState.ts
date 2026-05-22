import type { WasteListItem } from "@/modules/waste/types/list"
import { ref } from "vue"
import { toastListPossiblyStale } from "@/infrastructure/appToast"
import { createWaste } from "@/modules/waste/services/waste/createWaste"
import { deleteWaste } from "@/modules/waste/services/waste/deleteWaste"
import { fetchWastePage } from "@/modules/waste/services/waste/fetchWastePage"
import { updateWaste } from "@/modules/waste/services/waste/updateWaste"
import type { WasteUpsertDraft } from "@/modules/waste/types/list"
import { PAGINATED_LIST_DEFAULT_PAGE_SIZE } from "@/shared/lib/paginatedListDefaults"

const items = ref<WasteListItem[]>([])
export const wastePage = ref(1)
export const wastePageSize = ref(PAGINATED_LIST_DEFAULT_PAGE_SIZE)
export const wasteTotal = ref(0)

let loadGeneration = 0

async function applyPageResult(data: Awaited<ReturnType<typeof fetchWastePage>>) {
    items.value = data.items
    wasteTotal.value = data.total
    wastePage.value = data.page
    wastePageSize.value = data.pageSize
}

async function fetchAndApply(opts?: { page?: number; pageSize?: number }): Promise<void> {
    if (opts?.page != null) wastePage.value = opts.page
    if (opts?.pageSize != null) wastePageSize.value = opts.pageSize
    const data = await fetchWastePage(wastePage.value, wastePageSize.value)
    await applyPageResult(data)
    loadGeneration++
}

async function tryFetchAndApply(opts?: { page?: number; pageSize?: number }): Promise<void> {
    try {
        await fetchAndApply(opts)
    } catch {
        toastListPossiblyStale()
    }
}

export async function loadWasteItemsList(opts?: { page?: number; pageSize?: number }): Promise<void> {
    const gen = ++loadGeneration
    if (opts?.page != null) wastePage.value = opts.page
    if (opts?.pageSize != null) wastePageSize.value = opts.pageSize
    const data = await fetchWastePage(wastePage.value, wastePageSize.value)
    if (gen !== loadGeneration) return
    await applyPageResult(data)
}

async function reloadListAfterMutation(): Promise<void> {
    try {
        await fetchAndApply()
    } catch {
        toastListPossiblyStale()
        return
    }
    if (items.value.length === 0 && wastePage.value > 1) {
        await tryFetchAndApply({ page: wastePage.value - 1 })
    }
}

export async function removeWasteFromList(id: string): Promise<void> {
    await deleteWaste(id)
    await reloadListAfterMutation()
}

export async function addWasteToList(draft: WasteUpsertDraft): Promise<void> {
    await createWaste(draft)
    await tryFetchAndApply({ page: 1 })
}

export async function updateWasteInList(id: string, draft: WasteUpsertDraft): Promise<void> {
    await updateWaste(id, draft)
    await tryFetchAndApply()
}

export { items as wasteItemsListRef }
