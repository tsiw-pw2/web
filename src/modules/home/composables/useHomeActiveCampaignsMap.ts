import { onMounted, ref } from "vue"
import type { HomeCampaignMapPoint } from "@/modules/home/types/homeCampaignMap"
import { formatHomeCampaignLocation } from "@/modules/home/lib/formatHomeCampaignDate"
import { fetchPublicActiveCampaigns } from "@/modules/campaigns/services/campaigns/fetchPublicActiveCampaigns"

export function useHomeActiveCampaignsMap() {
    const points = ref<HomeCampaignMapPoint[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function loadPoints() {
        loading.value = true
        error.value = null
        try {
            const campaigns = await fetchPublicActiveCampaigns()
            const nextPoints: HomeCampaignMapPoint[] = []
            const seenBeachIds = new Set<string>()

            for (const campaign of campaigns) {
                for (const beach of campaign.beaches) {
                    if (!beach.latitude || !beach.longitude || seenBeachIds.has(beach.id)) continue
                    seenBeachIds.add(beach.id)
                    nextPoints.push({
                        id: beach.id,
                        beachName: beach.name,
                        latitude: String(beach.latitude),
                        longitude: String(beach.longitude),
                        locationLabel: formatHomeCampaignLocation(
                            beach.municipality ?? campaign.organizationMunicipality,
                            null,
                        ),
                        campaignId: campaign.id,
                        title: campaign.title,
                        startDate: campaign.startDate,
                    })
                }
            }
            points.value = nextPoints
        } catch {
            points.value = []
            error.value = "Não foi possível carregar as campanhas no mapa."
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        void loadPoints()
    })

    return {
        points,
        loading,
        error,
        reload: loadPoints,
    }
}
