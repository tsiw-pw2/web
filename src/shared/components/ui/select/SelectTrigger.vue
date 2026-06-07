<script setup lang="ts">
import type { ComponentPublicInstance, HTMLAttributes } from "vue"
import FieldClearIcon from "@/shared/components/icons/FieldClearIcon.vue"
import SelectChevronDownIcon from "@/shared/components/icons/SelectChevronDownIcon.vue"
import { cn } from "@/shared/lib/utils"
import { SELECT_CLEAR_BUTTON, SELECT_TRIGGER_COMBO, SELECT_TRIGGER_LAYOUT } from "./design"

const props = defineProps<{
    listboxId: string
    triggerId?: string
    open: boolean
    disabled?: boolean
    labelClass: string
    labelText: string
    showClear?: boolean
    clearLabel?: string
    setTriggerRef: (el: HTMLElement | null) => void
    class?: HTMLAttributes["class"]
    toggle: () => void
    onClear: () => void
    onTriggerKeydown: (e: KeyboardEvent) => void
}>()

function onShellRef(el: Element | ComponentPublicInstance | null) {
    const node = el && "$el" in el ? (el.$el as HTMLElement | undefined) : (el as HTMLElement | null)
    props.setTriggerRef(node instanceof HTMLElement ? node : null)
}
</script>

<template>
    <div
        :ref="onShellRef"
        :data-state="open ? 'open' : 'closed'"
        :class="cn(SELECT_TRIGGER_LAYOUT, disabled && 'pointer-events-none', props.class)"
    >
        <button
            :id="triggerId ?? `${listboxId}-trigger`"
            type="button"
            role="combobox"
            :aria-expanded="open"
            :aria-controls="listboxId"
            aria-haspopup="listbox"
            :disabled="disabled"
            :class="SELECT_TRIGGER_COMBO"
            @click="toggle"
            @keydown="onTriggerKeydown"
        >
            <span :class="labelClass">{{ labelText }}</span>
            <SelectChevronDownIcon v-if="showClear !== true" class="shrink-0" />
        </button>
        <button
            v-if="showClear === true && !disabled"
            type="button"
            :class="SELECT_CLEAR_BUTTON"
            :aria-label="clearLabel ?? 'Limpar seleção'"
            @mousedown.prevent
            @click.stop="onClear"
        >
            <FieldClearIcon />
        </button>
    </div>
</template>
