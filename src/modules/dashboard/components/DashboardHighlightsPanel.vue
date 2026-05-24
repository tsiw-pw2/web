<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router"
import { RouterLink } from "vue-router"
import DashboardKeyValueRows from "@/modules/dashboard/components/DashboardKeyValueRows.vue"
import DashboardPanel from "@/modules/dashboard/components/DashboardPanel.vue"
import DashboardPanelHeader from "@/modules/dashboard/components/DashboardPanelHeader.vue"
import type { DashboardKeyValueRow } from "@/modules/dashboard/types"

defineProps<{
    nextCampaignRows: DashboardKeyValueRow[]
    topBeachRows: DashboardKeyValueRow[]
    nextCampaignTo: string | RouteLocationRaw
    beachesTo: string | RouteLocationRaw
}>()
</script>

<template>
    <DashboardPanel class="h-full">
        <DashboardPanelHeader title="Em destaque" :more-to="nextCampaignTo" more-label="Ver campanhas" />
        <div class="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div class="min-w-0 space-y-2">
                <p class="text-sm font-medium leading-5 text-neutral-500">Próxima campanha</p>
                <DashboardKeyValueRows
                    :rows="nextCampaignRows"
                    :value-truncate-min-length="28"
                    :truncate-value-for-labels="['Título']"
                />
            </div>
            <div class="min-w-0 space-y-2 lg:border-s lg:border-neutral-200 lg:ps-8">
                <div class="flex min-w-0 items-center justify-between gap-2">
                    <p class="text-sm font-medium leading-5 text-neutral-500">Praias com mais recolhas</p>
                    <RouterLink
                        :to="beachesTo"
                        class="shrink-0 text-sm font-medium text-neutral-400 underline decoration-1 underline-offset-4 decoration-neutral-400 hover:text-neutral-600 hover:decoration-neutral-600"
                    >
                        Ver mais
                    </RouterLink>
                </div>
                <DashboardKeyValueRows :rows="topBeachRows" />
            </div>
        </div>
    </DashboardPanel>
</template>
