<script setup lang="ts">
import type { DashboardKeyValueRow } from "@/modules/dashboard/types"
import TruncatedTextWithTooltip from "@/shared/components/TruncatedTextWithTooltip.vue"

const props = defineProps<{
    rows: DashboardKeyValueRow[]
    valueTruncateMinLength?: number
    truncateValueForLabels?: string[]
}>()

const BADGE_VALUE_LABEL = "Resíduo mais comum"

function isBadgeValueRow(row: DashboardKeyValueRow): boolean {
    return row.label === BADGE_VALUE_LABEL
}

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
    <div class="flex flex-col gap-2">
        <div v-for="(row, i) in rows" :key="i" class="flex min-w-0 items-center gap-4">
            <span class="min-w-0 flex-1 text-base font-medium leading-6 text-neutral-500">{{ row.label }}</span>
            <TruncatedTextWithTooltip
                v-if="shouldTruncateValue(row)"
                :text="row.value"
                class="max-w-[min(50%,14rem)] text-base font-medium leading-6 text-neutral-950 tabular-nums"
            />
            <span
                v-else-if="isBadgeValueRow(row)"
                class="badge-neutral-950/8 max-w-[min(50%,14rem)] shrink-0 truncate text-end tabular-nums"
            >
                {{ row.value }}
            </span>
            <span
                v-else
                class="shrink-0 whitespace-nowrap text-end text-base font-medium leading-6 text-neutral-950 tabular-nums"
            >
                {{ row.value }}
            </span>
        </div>
    </div>
</template>
