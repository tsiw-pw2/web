<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { FileText, Umbrella, Users } from "lucide-vue-next"
import { routePaths } from "../app/router"
import DashboardListRow from "../components/domain/dashboard/DashboardListRow.vue"
import DashboardPanelCard from "../components/domain/dashboard/DashboardPanelCard.vue"
import DashboardStatCard from "../components/domain/dashboard/DashboardStatCard.vue"
import AsyncDataView from "../components/ui/AsyncDataView.vue"
import { useCampaigns } from "../composables/useCampaigns"
import { useBeaches } from "../composables/useBeaches"
import { useResiduos } from "../composables/useResiduos"
import { useRecolhas } from "../composables/useRecolhas"
import { useAuth } from "../composables/useAuth"
import { useAsyncDataPhase } from "../composables/useAsyncDataPhase"
import { fetchAdminDashboard } from "../services/admin.api"
import * as campaignsApi from "../services/campaigns.api"
import { formatDatePt } from "../utils/date"

const { campaigns, concludedCount, nextCampaign, loadCampaigns, loading: loadC, error: errC } = useCampaigns()
const { beaches, loadBeaches, loading: loadB, error: errB } = useBeaches()
const { residuos, loadResiduos, loading: loadR, error: errR } = useResiduos()
const { totalKg, totalQuantidade, loadRecolhasAggregated, loading: loadRec } = useRecolhas()
const { isAdmin, profile } = useAuth()

const volunteerConfirmedTotal = ref(0)
const utilizadoresTotal = ref<number | null>(null)
const adminDashError = ref<string | null>(null)
const extrasLoading = ref(true)

const nextInscritos = ref("—")

async function refreshNextInscritos() {
    const c = nextCampaign.value
    if (!c) {
        nextInscritos.value = "—"
        return
    }
    try {
        const { data } = await campaignsApi.fetchRegistrations(c.id)
        const rows = data as { estado?: number }[]
        nextInscritos.value = String(rows.filter((x) => Number(x.estado) === 1).length)
    } catch {
        nextInscritos.value = "—"
    }
}

watch(nextCampaign, () => {
    void refreshNextInscritos()
})

onMounted(async () => {
    adminDashError.value = null
    extrasLoading.value = true
    try {
        await Promise.all([loadCampaigns(), loadBeaches(), loadResiduos()])
        if (isAdmin.value) {
            try {
                const d = await fetchAdminDashboard()
                volunteerConfirmedTotal.value = d.inscricoes_confirmadas
                utilizadoresTotal.value = d.utilizadores_total
            } catch {
                volunteerConfirmedTotal.value = 0
                adminDashError.value = "Algumas estatísticas da equipa não carregaram. Os números abaixo podem estar incompletos."
            }
        } else {
            let n = 0
            const uid = profile.value?.id
            for (const c of campaigns.value) {
                if (!uid || c.organizerId === uid) {
                    try {
                        const { data } = await campaignsApi.fetchRegistrations(c.id)
                        const rows = data as { funcao?: number; estado?: number }[]
                        n += rows.filter((x) => Number(x.funcao) === 0 && Number(x.estado) === 1).length
                    } catch {
                        /* sem permissão */
                    }
                }
            }
            volunteerConfirmedTotal.value = n
            utilizadoresTotal.value = null
        }
        await loadRecolhasAggregated()
        await refreshNextInscritos()
    } finally {
        extrasLoading.value = false
    }
})

const campaignCount = computed(() => campaigns.value.length)
const beachCount = computed(() => beaches.value.length)

const kgDisplay = computed(() => Math.round(totalKg.value * 10) / 10)
const topWasteName = computed(() => residuos.value[0]?.nome ?? "—")

const nextTitle = computed(() => nextCampaign.value?.title ?? "—")
const nextDate = computed(() =>
    nextCampaign.value ? formatDatePt(nextCampaign.value.startDate) : "—",
)

const nextPraiasCount = computed(() =>
    nextCampaign.value ? String(nextCampaign.value.beachIds.length) : "—",
)

const coreLoading = computed(() => loadC.value || loadB.value || loadR.value)
const coreError = computed(() => errC.value || errB.value || errR.value || null)
const coreEmpty = computed(
    () =>
        !coreLoading.value &&
        !coreError.value &&
        campaigns.value.length === 0 &&
        beaches.value.length === 0 &&
        residuos.value.length === 0,
)
const corePhase = useAsyncDataPhase(coreLoading, coreError, coreEmpty)
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col gap-6">
        <AsyncDataView :phase="corePhase" :error-message="coreError">
            <template #empty>
                <p class="text-sm font-medium text-neutral-600">Sem campanhas, praias nem materiais no catálogo.</p>
            </template>

            <p v-if="extrasLoading" class="text-sm text-neutral-500">A atualizar estatísticas…</p>
            <p v-if="adminDashError" class="text-sm text-amber-800">{{ adminDashError }}</p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <DashboardStatCard label="Campanhas" :value="campaignCount">
                    <template #icon>
                        <FileText aria-hidden="true" />
                    </template>
                </DashboardStatCard>
                <DashboardStatCard label="Praias" :value="beachCount">
                    <template #icon>
                        <Umbrella aria-hidden="true" />
                    </template>
                </DashboardStatCard>
                <DashboardStatCard label="Voluntários (inscrições confirmadas)" :value="volunteerConfirmedTotal">
                    <template #icon>
                        <Users aria-hidden="true" />
                    </template>
                </DashboardStatCard>
            </div>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <DashboardPanelCard title="Impacto das limpezas" :more-to="routePaths.residuos">
                    <p v-if="loadRec" class="mb-2 text-sm text-neutral-500">A carregar dados de recolha…</p>
                    <DashboardListRow label="Campanhas já realizadas">{{ concludedCount }}</DashboardListRow>
                    <DashboardListRow label="Quilogramas retirados (estimado)">{{ kgDisplay }}</DashboardListRow>
                    <DashboardListRow label="Peças ou unidades contabilizadas">{{ totalQuantidade }}</DashboardListRow>
                    <DashboardListRow label="Material mais listado no catálogo">
                        <span
                            class="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-sm font-semibold leading-5 text-neutral-950"
                        >
                            {{ topWasteName }}
                        </span>
                    </DashboardListRow>
                </DashboardPanelCard>

                <DashboardPanelCard title="Próxima campanha" :more-to="routePaths.campanhas">
                    <DashboardListRow label="Título">{{ nextTitle }}</DashboardListRow>
                    <DashboardListRow label="Data">{{ nextDate }}</DashboardListRow>
                    <DashboardListRow label="Inscritos confirmados">{{ nextInscritos }}</DashboardListRow>
                    <DashboardListRow label="Praias envolvidas nesta ação">{{ nextPraiasCount }}</DashboardListRow>
                </DashboardPanelCard>
            </div>

            <DashboardPanelCard v-if="isAdmin && utilizadoresTotal != null" title="Comunidade" :more-to="routePaths.definicoes">
                <DashboardListRow label="Contas registadas">{{ utilizadoresTotal }}</DashboardListRow>
            </DashboardPanelCard>
        </AsyncDataView>
    </div>
</template>
