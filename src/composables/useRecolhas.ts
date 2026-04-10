import { computed, ref } from "vue"
import type { RecolhaResiduo } from "../types/domain"
import { mapRecolha, type ApiRecolhaRow } from "../lib/apiMappers"
import * as api from "../services/campaigns.api"
import { useAuth } from "./useAuth"
import { useCampaigns } from "./useCampaigns"

const recolhas = ref<RecolhaResiduo[]>([])
const loading = ref(false)

export function useRecolhas() {
    const { profile, isAdmin } = useAuth()
    const { campaigns } = useCampaigns()

    async function loadRecolhasAggregated() {
        loading.value = true
        try {
            if (isAdmin.value) {
                const all: RecolhaResiduo[] = []
                for (const c of campaigns.value) {
                    try {
                        const { data } = await api.fetchRecolhasForCampaign(c.id)
                        all.push(...data.map((row) => mapRecolha(row as ApiRecolhaRow)))
                    } catch {
                        /* ignore campaigns without permission */
                    }
                }
                recolhas.value = all
            } else {
                const uid = profile.value?.id
                const mine = uid
                    ? campaigns.value.filter((c) => c.organizerId === uid)
                    : []
                const all: RecolhaResiduo[] = []
                for (const c of mine) {
                    try {
                        const { data } = await api.fetchRecolhasForCampaign(c.id)
                        all.push(...data.map((row) => mapRecolha(row as ApiRecolhaRow)))
                    } catch {
                        /* ignore */
                    }
                }
                recolhas.value = all
            }
        } finally {
            loading.value = false
        }
    }

    const totalQuantidade = computed(() =>
        recolhas.value.reduce((s, x) => s + x.quantidadeUnidades, 0),
    )

    const totalKg = computed(() =>
        recolhas.value.reduce((s, x) => s + (x.pesoRealKg != null ? x.pesoRealKg : 0), 0),
    )

    return {
        recolhas,
        loading,
        loadRecolhasAggregated,
        totalQuantidade,
        totalKg,
    }
}
