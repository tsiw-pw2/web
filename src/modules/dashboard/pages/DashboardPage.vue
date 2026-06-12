<script setup lang="ts">import { computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { canAccessDashboard } from "@/modules/auth/lib/accessPolicy"
import CampaignIcon from "@/shared/components/icons/dashboard/DashboardCampaignIcon.vue"
import CoastIcon from "@/shared/components/icons/dashboard/DashboardCoastIcon.vue"
import VolunteerIcon from "@/shared/components/icons/dashboard/DashboardVolunteerIcon.vue"
import { DashboardKeyValuePanel, DashboardMetricPanel } from "@/modules/dashboard"
import { useDashboardOverview } from "@/modules/dashboard/composables/useDashboardOverview"
import { routePaths } from "@/app/router"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"
import PageContentInset from "@/shared/components/layout/PageContentInset.vue"
import { stripYearFromPtLongDate } from "@/shared/lib/formatPt"
import type { DashboardKeyValueRow } from "@/modules/dashboard/types"

const router = useRouter()
const { overview, loading, error, reload } = useDashboardOverview()
const { profile, loadProfile } = useCurrentProfile()

onMounted(() => {
    void loadProfile()
})

watch(
    profile,
    (p) => {
        if (p && !canAccessDashboard(p)) {
            void router.replace(routePaths.campaigns)
        }
    },
    { immediate: true },
)

const showAdminStyleMetrics = computed(() => {
    const p = profile.value
    if (!p) return false
    return p.isOrganizer === true && p.isRoot !== true
})

const nextCampaignMoreTo = computed(() => {
    const id = overview.value?.nextCampaignId
    if (id) {
        return { name: "campaign-details", params: { campaignId: id, tab: "informacoes" } }
    }
    return routePaths.campaigns
})

const nextCampaignDisplayRows = computed((): DashboardKeyValueRow[] => {
    const rows = overview.value?.nextCampaignRows ?? []
    return rows.map((row) => {
        if (row.label !== "Data") return row
        return { ...row, value: stripYearFromPtLongDate(row.value) }
    })
})
</script>

<template>
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-none">
        <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>

        <ResourceErrorState
            v-else-if="error"
            class="py-8"
            title="Não foi possível carregar o painel"
            :hint="error"
            action-label="Tentar novamente"
            @retry="reload"
        />

        <PageContentInset v-else-if="overview" class="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            <template v-if="showAdminStyleMetrics">
                <DashboardMetricPanel
                    class="sm:col-span-1 lg:col-span-2"
                    title="Campanhas"
                    :value="String(overview.metrics.campaignCount)"
                    :more-to="routePaths.campaigns"
                >
                    <template #icon>
                        <CampaignIcon />
                    </template>
                </DashboardMetricPanel>
                <DashboardMetricPanel
                    class="sm:col-span-1 lg:col-span-2"
                    title="Praias"
                    :value="String(overview.metrics.beachCount)"
                    :more-to="routePaths.beaches"
                >
                    <template #icon>
                        <CoastIcon />
                    </template>
                </DashboardMetricPanel>
                <DashboardMetricPanel
                    class="sm:col-span-2 lg:col-span-2"
                    title="Utilizadores"
                    :value="String(overview.metrics.userCount)"
                    :more-to="{ name: 'settings-users' }"
                >
                    <template #icon>
                        <VolunteerIcon />
                    </template>
                </DashboardMetricPanel>
            </template>
            <div
                v-else
                class="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 sm:col-span-2 lg:col-span-6"
            >
                O painel mostra o impacto conjunto na costa.
                <RouterLink :to="routePaths.campaigns" class="font-medium text-neutral-950 underline hover:text-neutral-700">
                    Explora as campanhas
                </RouterLink>
                para te envolveres numa ação de limpeza.
            </div>
            <DashboardKeyValuePanel
                class="sm:col-span-2 lg:col-span-3"
                title="Estatísticas de limpeza"
                :rows="overview.cleaningStatsRows"
            />
            <DashboardKeyValuePanel
                class="sm:col-span-2 lg:col-span-3"
                title="Próxima Campanha"
                :rows="nextCampaignDisplayRows"
                :more-to="nextCampaignMoreTo"
                :value-truncate-min-length="28"
                :truncate-value-for-labels="['Título']"
            />
        </PageContentInset>

        <div v-else class="text-sm leading-5 text-neutral-600">Não há dados de painel disponíveis.</div>
    </div>
</template>
