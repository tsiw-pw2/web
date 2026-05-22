<script setup lang="ts">
import type { ComponentPublicInstance, HTMLAttributes } from "vue"
import SelectChevronDownIcon from "@/shared/components/icons/SelectChevronDownIcon.vue"
import { cn } from "@/shared/lib/utils"
import { SELECT_TRIGGER_LAYOUT } from "./design"

const props = defineProps<{
    listboxId: string
    open: boolean
    disabled?: boolean
    labelClass: string
    labelText: string
    setTriggerRef: (el: HTMLElement | null) => void
    class?: HTMLAttributes["class"]
    toggle: () => void
    onTriggerKeydown: (e: KeyboardEvent) => void
}>()

function onTriggerRef(el: Element | ComponentPublicInstance | null) {
    const node = el && "$el" in el ? (el.$el as HTMLElement | undefined) : (el as HTMLElement | null)
    props.setTriggerRef(node instanceof HTMLElement ? node : null)
}
</script>

<template>
     <button
        :id="`${listboxId}-trigger`"
        :ref="onTriggerRef"
        type="button"
        role="combobox"
        :aria-expanded="open"
        :aria-controls="listboxId"
        aria-haspopup="listbox"
        :disabled="disabled"
        :data-state="open ? 'open' : 'closed'"
        :class="cn(SELECT_TRIGGER_LAYOUT, props.class)"
        @click="toggle"
        @keydown="onTriggerKeydown"
    >
         <span :class="labelClass">{{ labelText }}</span
        > <SelectChevronDownIcon /> </button
    >
</template>

