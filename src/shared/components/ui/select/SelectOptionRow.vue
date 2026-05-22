<script setup lang="ts">
import SelectOptionCheckIcon from "@/shared/components/icons/SelectOptionCheckIcon.vue"
import { selectOptionClasses } from "./design"
import type { SelectOption } from "./types"

const props = defineProps<{
    opt: SelectOption
    index: number
    listboxId: string
    selected: boolean
    highlighted: boolean
    onOptionMouseDown: (i: number) => void
    onOptionMouseEnter: (i: number) => void
}>()

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
         <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"> <SelectOptionCheckIcon v-if="selected" /> </span> <span class="block truncate">{{ opt.label }}</span
        >
    </div>

</template>

