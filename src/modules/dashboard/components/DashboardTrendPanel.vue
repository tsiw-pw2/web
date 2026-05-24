<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { DashboardMonthlyTrendPoint } from "@/modules/dashboard/types"
import DashboardPanel from "@/modules/dashboard/components/DashboardPanel.vue"
import DashboardPanelHeader from "@/modules/dashboard/components/DashboardPanelHeader.vue"
import DashboardTrendChart from "@/modules/dashboard/components/DashboardTrendChart.vue"
import { cn } from "@/shared/lib/utils"

defineProps<{
    title: string
    points: DashboardMonthlyTrendPoint[]
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <DashboardPanel :class="cn('h-full', $props.class)">
        <DashboardPanelHeader :title="title" />
        <DashboardTrendChart :points="points" />
    </DashboardPanel>
</template>
