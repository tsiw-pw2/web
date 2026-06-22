import { onMounted, ref } from "vue"
import type { HomeCampaignMapPoint } from "@/modules/home/types/homeCampaignMap"
import { formatHomeCampaignLocation } from "@/modules/home/lib/formatHomeCampaignDate"
import { fetchPublicCampaignMap } from "@/modules/home/services/fetchPublicCampaignMap"

// Composable que gere a lógica do mapa de campanhas activas na homepage (público).
export function useHomeActiveCampaignsMap() {
    const points = ref<HomeCampaignMapPoint[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function loadPoints() {
        loading.value = true
        error.value = null
        try {
            const pins = await fetchPublicCampaignMap()
            points.value = pins.map((pin) => ({
                id: pin.beachId,
                beachName: pin.beachName,
                latitude: pin.latitude,
                longitude: pin.longitude,
                locationLabel: formatHomeCampaignLocation(pin.municipality, pin.district),
                campaignId: pin.campaignId,
                title: pin.title,
                startDate: pin.startDate,
                endDate: pin.endDate,
                status: pin.status,
            }))
        } catch {
            points.value = []
            error.value = "Não foi possível carregar as campanhas no mapa. Verifique a ligação e tente novamente."
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
