<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import DashboardPanel from "./DashboardPanel.vue"
import DashboardPanelHeader from "./DashboardPanelHeader.vue"
import type { DashboardKeyValueRow } from "../types"
import TruncatedTextWithTooltip from "@/shared/components/TruncatedTextWithTooltip.vue"

const props = defineProps<{
    title: string
    rows: DashboardKeyValueRow[]
    class?: HTMLAttributes["class"]
    moreHref?: string
    moreLabel?: string
    valueTruncateMinLength?: number
    truncateValueForLabels?: string[]
}>()

function shouldTruncateValue(row: DashboardKeyValueRow): boolean {
    const min = props.valueTruncateMinLength
    if (min == null || min <= 0) return false
    if (props.truncateValueForLabels?.length && !props.truncateValueForLabels.includes(row.label)) {
        return false
    }
    return row.value.length >= min
}
</script>

<template>
    <DashboardPanel :class="props.class">
        <DashboardPanelHeader :title="title" :more-href="moreHref" :more-label="moreLabel">
            <template #icon>
                <slot name="icon" />
            </template>
        </DashboardPanelHeader>
        <div class="flex flex-col gap-2">
            <div v-for="(row, i) in rows" :key="i" class="flex min-w-0 items-center gap-4">
                <span class="min-w-0 flex-1 text-base font-medium leading-6 text-neutral-500">{{ row.label }}</span>
                <TruncatedTextWithTooltip
                    v-if="shouldTruncateValue(row)"
                    :text="row.value"
                    class="max-w-[min(50%,14rem)] text-base font-medium leading-6 text-neutral-950 tabular-nums"
                />
                <span
                    v-else
                    class="shrink-0 whitespace-nowrap text-end text-base font-medium leading-6 text-neutral-950 tabular-nums"
                >
                    {{ row.value }}
                </span>
            </div>
        </div>
    </DashboardPanel>
</template>