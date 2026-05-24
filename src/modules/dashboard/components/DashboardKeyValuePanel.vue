<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/shared/lib/utils"
import DashboardKeyValueRows from "@/modules/dashboard/components/DashboardKeyValueRows.vue"
import DashboardPanel from "./DashboardPanel.vue"
import DashboardPanelHeader from "./DashboardPanelHeader.vue"
import type { DashboardKeyValueRow } from "../types"

const props = defineProps<{
    title: string
    rows: DashboardKeyValueRow[]
    class?: HTMLAttributes["class"]
    moreHref?: string
    moreLabel?: string
    valueTruncateMinLength?: number
    truncateValueForLabels?: string[]
}>()
</script>

<template>
    <DashboardPanel :class="cn('h-full', props.class)">
        <DashboardPanelHeader :title="title" :more-href="moreHref" :more-label="moreLabel">
            <template #icon>
                <slot name="icon" />
            </template>
        </DashboardPanelHeader>
        <DashboardKeyValueRows
            :rows="rows"
            :value-truncate-min-length="valueTruncateMinLength"
            :truncate-value-for-labels="truncateValueForLabels"
        />
    </DashboardPanel>
</template>
