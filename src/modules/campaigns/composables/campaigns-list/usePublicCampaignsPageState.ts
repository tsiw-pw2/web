import { onMounted, ref } from "vue"
import { fetchPublicActiveCampaigns, type PublicActiveCampaign } from "@/modules/campaigns/services/campaigns/fetchPublicActiveCampaigns"

export function usePublicCampaignsPageState() {
    const loading = ref(false)
    const error = ref(false)
    const campaigns = ref<PublicActiveCampaign[]>([])

    async function reload() {
        loading.value = true
        error.value = false
        try {
            campaigns.value = await fetchPublicActiveCampaigns()
        } catch {
            campaigns.value = []
            error.value = true
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        void reload()
    })

    return {
        loading,
        error,
        campaigns,
        reload,
    }
}
