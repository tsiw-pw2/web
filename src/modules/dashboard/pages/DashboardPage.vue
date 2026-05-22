<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import { DashboardKeyValuePanel, DashboardMetricPanel } from "@/modules/dashboard"
import CampaignIcon from "@/shared/components/icons/dashboard/DashboardCampaignIcon.vue"
import CoastIcon from "@/shared/components/icons/dashboard/DashboardCoastIcon.vue"
import VolunteerIcon from "@/shared/components/icons/dashboard/DashboardVolunteerIcon.vue"
import { useDashboardOverview } from "@/modules/dashboard/composables/useDashboardOverview"
import { routePaths } from "@/app/router"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"

const { overview, loading, error } = useDashboardOverview()
const profile = ref<SettingsProfile | null>(null)

onMounted(async () => {
    try {
        profile.value = await fetchProfile()
    } catch {
        profile.value = null
    }
})

const showAdminStyleMetrics = computed(() => {
    const p = profile.value
    if (!p) return true
    return p.isAdmin === true || p.isOrganizer === true
})

const nextCampaignMoreTo = computed(() => {
    const id = overview.value?.nextCampaignId
    if (id) {
        return { name: "campaign-details", params: { campaignId: id, tab: "informacoes" } }
    }
    return routePaths.campaigns
})
</script>

<template>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-none">

        <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>

        <div v-else-if="error" class="text-sm leading-5 text-neutral-600">{{ error }}</div>

        <div v-else-if="overview" class="grid min-w-0 grid-cols-1 gap-6 p-px sm:grid-cols-2 lg:grid-cols-6">
             <template v-if="showAdminStyleMetrics"
                > <DashboardMetricPanel
                    class="sm:col-span-1 lg:col-span-2"
                    title="Campanhas"
                    :value="String(overview.metrics.campaignCount)"
                    :more-to="routePaths.campaigns"
                    > <template #icon> <CampaignIcon /> </template> </DashboardMetricPanel
                > <DashboardMetricPanel
                    class="sm:col-span-1 lg:col-span-2"
                    title="Praias"
                    :value="String(overview.metrics.beachCount)"
                    :more-to="routePaths.beaches"
                    > <template #icon> <CoastIcon /> </template> </DashboardMetricPanel
                > <DashboardMetricPanel
                    class="sm:col-span-1 lg:col-span-2"
                    title="Voluntários"
                    :value="String(overview.metrics.volunteerCount)"
                    :more-to="{ name: 'settings-users', query: { role: 'volunteer' } }"
                    > <template #icon> <VolunteerIcon /> </template> </DashboardMetricPanel
                > </template
            >
            <div v-else class="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 sm:col-span-2 lg:col-span-6">
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
                :more-to="routePaths.campaigns"
            />
            <DashboardKeyValuePanel
                class="sm:col-span-2 lg:col-span-3"
                title="Próxima Campanha"
                :rows="overview.nextCampaignRows"
                :more-to="nextCampaignMoreTo"
                :value-truncate-min-length="28"
                :truncate-value-for-labels="['Título']"
            />
        </div>

        <div v-else class="text-sm leading-5 text-neutral-600">Não há dados de painel disponíveis.</div>

    </div>

</template>

