import { ref, watch, type Ref } from "vue"
import type { HomeCampaignMapPoint } from "@/modules/home/types/homeCampaignMap"
import { beachLocationLabel } from "@/modules/home/lib/beachLocationLabel"
import { formatHomeCampaignLocation } from "@/modules/home/lib/formatHomeCampaignDate"
import { fetchBeachesPage } from "@/modules/beaches/services/beaches/fetchBeachesPage"
import { fetchCampaignsPage } from "@/modules/campaigns/services/campaigns/fetchCampaignsPage"
import { getCampaignDetails } from "@/modules/campaigns/services/campaignDetails"
import { PAGINATED_LIST_MAX_PAGE_SIZE } from "@/shared/lib/paginatedListDefaults"

const ACTIVE_STATUSES = ["aberta_inscricoes", "em_progresso", "encerrada_inscricoes"] as const

const MAX_CAMPAIGN_DETAILS = 20

type CampaignAtBeach = {
    campaignId: string
    title: string
    startDate: string
    locationLabel: string
}

export function useHomeActiveCampaignsMap(isAuthenticated: Ref<boolean>) {
    const points = ref<HomeCampaignMapPoint[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function loadCampaignsByBeachId(): Promise<Map<string, CampaignAtBeach>> {
        const list = await fetchCampaignsPage(1, PAGINATED_LIST_MAX_PAGE_SIZE, {
            status: [...ACTIVE_STATUSES],
        })
        const campaignIds = list.items.slice(0, MAX_CAMPAIGN_DETAILS).map((item) => item.id)
        const detailsResults = await Promise.allSettled(campaignIds.map((id) => getCampaignDetails(id)))

        const campaignByBeachId = new Map<string, CampaignAtBeach>()
        for (const result of detailsResults) {
            if (result.status !== "fulfilled") continue
            const campaign = result.value
            for (const beach of campaign.beaches) {
                if (campaignByBeachId.has(beach.id)) continue
                campaignByBeachId.set(beach.id, {
                    campaignId: campaign.id,
                    title: campaign.title,
                    startDate: campaign.startDate,
                    locationLabel: formatHomeCampaignLocation(beach.municipality, beach.district),
                })
            }
        }
        return campaignByBeachId
    }

    async function loadPoints() {
        if (!isAuthenticated.value) {
            points.value = []
            error.value = null
            loading.value = false
            return
        }

        loading.value = true
        error.value = null
        try {
            const [beachesPage, campaignByBeachId] = await Promise.all([
                fetchBeachesPage(1, PAGINATED_LIST_MAX_PAGE_SIZE),
                loadCampaignsByBeachId(),
            ])

            const nextPoints: HomeCampaignMapPoint[] = []
            for (const beach of beachesPage.items) {
                const campaign = campaignByBeachId.get(beach.id)
                nextPoints.push({
                    id: beach.id,
                    beachName: beach.name,
                    latitude: beach.latitude,
                    longitude: beach.longitude,
                    locationLabel: beachLocationLabel(beach),
                    campaignId: campaign?.campaignId ?? null,
                    title: campaign?.title ?? beach.name,
                    startDate: campaign?.startDate ?? "",
                })
            }
            points.value = nextPoints
        } catch {
            points.value = []
            error.value = "Não foi possível carregar as praias no mapa."
        } finally {
            loading.value = false
        }
    }

    watch(
        isAuthenticated,
        (authenticated) => {
            if (authenticated) {
                void loadPoints()
                return
            }
            points.value = []
            error.value = null
            loading.value = false
        },
        { immediate: true },
    )

    return {
        points,
        loading,
        error,
        reload: loadPoints,
    }
}
