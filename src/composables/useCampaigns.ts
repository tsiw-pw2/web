import { computed, ref } from "vue"
import type { Campaign, CampaignDraft } from "../types/domain"
import {
    campaignDraftToApi,
    mapCampaignDetail,
    mapCampaignListItem,
} from "../lib/apiMappers"
import * as api from "../services/campaigns.api"
import { useAuth } from "./useAuth"

const campaigns = ref<Campaign[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

type CreatedCampaign = { id: string }

export function useCampaigns() {
    const { isAdmin, isOrganizer } = useAuth()

    async function loadCampaigns() {
        loading.value = true
        error.value = null
        try {
            const out = await api.fetchCampaignsList({ limit: 200 })
            campaigns.value = out.data.map(mapCampaignListItem)
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Erro ao carregar campanhas"
            campaigns.value = []
        } finally {
            loading.value = false
        }
    }

    async function fetchCampaignDetailById(id: string): Promise<Campaign> {
        const d = await api.fetchCampaignDetail(id)
        return mapCampaignDetail(d)
    }

    function assertCanManageCampaigns() {
        if (!isAdmin.value && !isOrganizer.value) {
            throw new Error("Precisas de sessão de organizador ou administrador para gerir campanhas.")
        }
    }

    async function addCampaign(draft: CampaignDraft) {
        assertCanManageCampaigns()
        const created = (await api.createCampaignApi(campaignDraftToApi(draft))) as CreatedCampaign
        if (created?.id) {
            await api.putCampaignBeachesApi(created.id, draft.beachIds)
        }
        await loadCampaigns()
    }

    async function updateCampaign(id: string, draft: CampaignDraft) {
        assertCanManageCampaigns()
        await api.patchCampaignApi(id, campaignDraftToApi(draft))
        await api.putCampaignBeachesApi(id, draft.beachIds)
        await loadCampaigns()
    }

    async function removeCampaign(id: string) {
        assertCanManageCampaigns()
        await api.deleteCampaignApi(id)
        await loadCampaigns()
    }

    const concludedCount = computed(() => campaigns.value.filter((c) => c.estado === 4).length)

    const nextCampaign = computed(() => {
        const open = campaigns.value.filter((c) => c.estado !== 4 && c.estado !== 5)
        if (!open.length) return null
        return [...open].sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
    })

    return {
        campaigns,
        loading,
        error,
        loadCampaigns,
        fetchCampaignDetailById,
        addCampaign,
        updateCampaign,
        removeCampaign,
        concludedCount,
        nextCampaign,
    }
}
