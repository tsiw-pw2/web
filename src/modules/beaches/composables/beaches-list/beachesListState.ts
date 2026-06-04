import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { ref } from "vue"
import { toastListPossiblyStale } from "@/infrastructure/appToast"
import { createBeach } from "@/modules/beaches/services/beaches/createBeach"
import { deleteBeach } from "@/modules/beaches/services/beaches/deleteBeach"
import { fetchBeachesPage } from "@/modules/beaches/services/beaches/fetchBeachesPage"
import { updateBeach } from "@/modules/beaches/services/beaches/updateBeach"
import { PAGINATED_LIST_DEFAULT_PAGE_SIZE } from "@/shared/lib/paginatedListDefaults"

const items = ref<BeachListItem[]>([])
export const beachesPage = ref(1)
export const beachesPageSize = ref(PAGINATED_LIST_DEFAULT_PAGE_SIZE)
export const beachesTotal = ref(0)

let loadGeneration = 0
let listLinks: ResourceLinks | undefined

async function applyPageResult(data: Awaited<ReturnType<typeof fetchBeachesPage>>) {
    items.value = data.items
    beachesTotal.value = data.total
    beachesPage.value = data.page
    beachesPageSize.value = data.pageSize
}

async function fetchAndApply(opts?: { page?: number; pageSize?: number }): Promise<void> {
    if (opts?.page != null) beachesPage.value = opts.page
    if (opts?.pageSize != null) beachesPageSize.value = opts.pageSize
    const data = await fetchBeachesPage(beachesPage.value, beachesPageSize.value, listLinks)
    listLinks = data.links
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

export async function loadBeachesList(opts?: { page?: number; pageSize?: number }): Promise<void> {
    const gen = ++loadGeneration
    if (opts?.page != null) beachesPage.value = opts.page
    if (opts?.pageSize != null) beachesPageSize.value = opts.pageSize
    const data = await fetchBeachesPage(beachesPage.value, beachesPageSize.value, listLinks)
    if (gen !== loadGeneration) return
    listLinks = data.links
    await applyPageResult(data)
}

async function reloadListAfterMutation(): Promise<void> {
    try {
        await fetchAndApply()
    } catch {
        toastListPossiblyStale()
        return
    }
    if (items.value.length === 0 && beachesPage.value > 1) {
        await tryFetchAndApply({ page: beachesPage.value - 1 })
    }
}

export async function removeBeachFromList(id: string): Promise<void> {
    const item = items.value.find((b) => b.id === id)
    await deleteBeach(item ?? id)
    await reloadListAfterMutation()
}

export async function addBeachToList(draft: BeachUpsertDraft): Promise<void> {
    await createBeach(draft)
    await tryFetchAndApply({ page: 1 })
}

export async function updateBeachInList(id: string, draft: BeachUpsertDraft): Promise<void> {
    const item = items.value.find((b) => b.id === id)
    await updateBeach(item ?? id, draft)
    await tryFetchAndApply()
}

export { items as beachesListRef }
