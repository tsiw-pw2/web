<script setup lang="ts">
import { computed } from "vue"
import SelectOptionCheckIcon from "@/shared/components/icons/SelectOptionCheckIcon.vue"
import { splitLabelByQuery } from "@/shared/lib/matchHighlight"
import { selectOptionClasses } from "@/shared/components/ui/select/design"
import type { SearchableSelectOption } from "./types"

const props = defineProps<{
    opt: SearchableSelectOption
    index: number
    listboxId: string
    selected: boolean
    highlighted: boolean
    query: string
    onOptionMouseDown: (i: number) => void
    onOptionMouseEnter: (i: number) => void
}>()

const segments = computed(() => splitLabelByQuery(props.opt.label, props.query))

function onMouseEnter() {
    if (props.opt.disabled) return
    props.onOptionMouseEnter(props.index)
}
</script>

<template>
    <div
        :id="`${listboxId}-opt-${index}`"
        role="option"
        :aria-selected="selected"
        :aria-disabled="opt.disabled || undefined"
        :class="selectOptionClasses(highlighted)"
        :data-disabled="opt.disabled ? '' : undefined"
        @mouseenter="onMouseEnter"
        @mousedown.prevent="onOptionMouseDown(index)"
    >
        <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectOptionCheckIcon v-if="selected" />
        </span>
        <span class="block truncate">
            <template v-for="(segment, segmentIndex) in segments" :key="segmentIndex">
                <span :class="segment.highlighted ? 'text-blue-600' : undefined">{{ segment.text }}</span>
            </template>
        </span>
    </div>
</template>
