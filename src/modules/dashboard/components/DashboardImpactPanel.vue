<script setup lang="ts">import type { RouteLocationRaw } from "vue-router"

import DashboardKeyValueRows from "@/modules/dashboard/components/DashboardKeyValueRows.vue"
import DashboardPanel from "@/modules/dashboard/components/DashboardPanel.vue"
import DashboardPanelHeader from "@/modules/dashboard/components/DashboardPanelHeader.vue"
import DashboardTrendChart from "@/modules/dashboard/components/DashboardTrendChart.vue"
import type { DashboardKeyValueRow, DashboardMonthlyTrendPoint } from "@/modules/dashboard/types"

defineProps<{
    cleaningStatsRows: DashboardKeyValueRow[]
    monthlyTrend: DashboardMonthlyTrendPoint[]
    wasteByTypeRows: DashboardKeyValueRow[]
    campaignsTo: string | RouteLocationRaw
    wasteTo: string | RouteLocationRaw
}>()
</script>

<template>
    <DashboardPanel class="h-full">
        <DashboardPanelHeader title="Impacto na costa" :more-to="campaignsTo" />
        <div class="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div class="min-w-0 space-y-2">
                <p class="text-sm font-medium leading-5 text-neutral-500">Estatísticas de limpeza</p>
                <DashboardKeyValueRows :rows="cleaningStatsRows" />
            </div>
            <div class="min-w-0 space-y-2 lg:border-s lg:border-neutral-200 lg:ps-8">
                <p class="text-sm font-medium leading-5 text-neutral-500">Recolhas por mês</p>
                <DashboardTrendChart :points="monthlyTrend" />
            </div>
        </div>
        <div
            v-if="wasteByTypeRows.length > 0"
            class="mt-6 border-t border-neutral-200 pt-6"
        >
            <div class="mb-3 flex min-w-0 items-center justify-between gap-2">
                <p class="text-sm font-medium leading-5 text-neutral-500">Impacto por tipo de resíduo</p>
                <RouterLink
                    :to="wasteTo"
                    class="shrink-0 text-sm font-medium text-neutral-400 underline decoration-1 underline-offset-4 decoration-neutral-400 hover:text-neutral-600 hover:decoration-neutral-600"
                >
                    Ver mais
                </RouterLink>
            </div>
            <DashboardKeyValueRows :rows="wasteByTypeRows" />
        </div>
    </DashboardPanel>
</template>
