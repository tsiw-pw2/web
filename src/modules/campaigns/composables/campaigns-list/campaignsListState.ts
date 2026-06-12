import type { CampaignCreateDraft, CampaignListFilters, CampaignListItem } from "@/modules/campaigns/types/list"
import type { ResourceLinks } from "@/infrastructure/hypermedia.types"
import { ref } from "vue"
import { getAccessToken } from "@/infrastructure/access-token"
import { toastListPossiblyStale } from "@/infrastructure/appToast"
import { createCampaign } from "@/modules/campaigns/services/campaigns/createCampaign"
import { deleteCampaign } from "@/modules/campaigns/services/campaigns/deleteCampaign"
import { fetchCampaignsPage } from "@/modules/campaigns/services/campaigns/fetchCampaignsPage"
import { updateCampaign } from "@/modules/campaigns/services/campaigns/updateCampaign"
import { PAGINATED_LIST_DEFAULT_PAGE_SIZE } from "@/shared/lib/paginatedListDefaults"

const campaigns = ref<CampaignListItem[]>([])
export const campaignsPage = ref(1)
export const campaignsPageSize = ref(PAGINATED_LIST_DEFAULT_PAGE_SIZE)
export const campaignsTotal = ref(0)

let loadGeneration = 0
let listFilters: CampaignListFilters = {}
let listLinks: ResourceLinks | undefined

export function setCampaignsListFilters(filters: CampaignListFilters) {
    listFilters = filters
    listLinks = undefined
}

async function applyPageResult(data: Awaited<ReturnType<typeof fetchCampaignsPage>>) {
    campaigns.value = data.items
    campaignsTotal.value = data.total
    campaignsPage.value = data.page
    campaignsPageSize.value = data.pageSize
}

async function fetchAndApply(opts?: { page?: number; pageSize?: number }): Promise<void> {
    if (opts?.page != null) campaignsPage.value = opts.page
    if (opts?.pageSize != null) campaignsPageSize.value = opts.pageSize
    const data = await fetchCampaignsPage(
        campaignsPage.value,
        campaignsPageSize.value,
        listFilters,
        listLinks,
    )
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

export async function loadCampaignsList(opts?: { page?: number; pageSize?: number }): Promise<void> {
    if (!getAccessToken()) return
    const gen = ++loadGeneration
    if (opts?.page != null) campaignsPage.value = opts.page
    if (opts?.pageSize != null) campaignsPageSize.value = opts.pageSize
    const data = await fetchCampaignsPage(
        campaignsPage.value,
        campaignsPageSize.value,
        listFilters,
        listLinks,
    )
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
    if (campaigns.value.length === 0 && campaignsPage.value > 1) {
        await tryFetchAndApply({ page: campaignsPage.value - 1 })
    }
}

export async function removeCampaignFromList(id: string): Promise<void> {
    const item = campaigns.value.find((c) => c.id === id)
    await deleteCampaign(item ?? id)
    await reloadListAfterMutation()
}

export async function addCampaignToList(draft: CampaignCreateDraft): Promise<void> {
    await createCampaign(draft)
    await tryFetchAndApply({ page: 1 })
}

export async function updateCampaignInList(id: string, draft: CampaignCreateDraft): Promise<void> {
    const item = campaigns.value.find((c) => c.id === id)
    await updateCampaign(item ?? id, draft)
    await tryFetchAndApply()
}

export { campaigns as campaignsListRef }
