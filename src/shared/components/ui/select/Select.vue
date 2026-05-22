<script lang="ts">
export type SelectOption = {
    value: string
    label: string
    disabled?: boolean
}
</script>

<script setup lang="ts">
import { onClickOutside, unrefElement } from "@vueuse/core"
import type { HTMLAttributes } from "vue"
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRef, useId, watch } from "vue"
import { cn } from "@/shared/lib/utils"
import { selectLabelClasses } from "./design"
import SelectList from "./SelectList.vue"
import SelectTrigger from "./SelectTrigger.vue"

const PANEL_MAX_HEIGHT_PX = 240

const props = withDefaults(
    defineProps<{
        options: SelectOption[]
        placeholder?: string
        disabled?: boolean
        class?: HTMLAttributes["class"]
        panelPlacement?: "auto" | "below" | "above"
    }>(),
    {
        placeholder: "",
        panelPlacement: "auto",
    },
)

const modelValue = defineModel<string | undefined>()

const options = toRef(props, "options")
const disabled = toRef(props, "disabled")
const placeholderRef = toRef(props, "placeholder")

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const highlightedIndex = ref(0)

const listboxId = useId()

const panelStyle = ref<Record<string, string>>({ top: "0px", left: "0px", width: "0px" })
const resolvedPanelPlacement = ref<"below" | "above">("below")

function resolvePlacement(r: DOMRect, gap: number): "below" | "above" {
    const vh = globalThis.innerHeight
    const spaceBelow = vh - r.bottom - gap
    const spaceAbove = r.top - gap
    if (props.panelPlacement === "below") return "below"
    if (props.panelPlacement === "above") return "above"
    if (spaceBelow >= PANEL_MAX_HEIGHT_PX) return "below"
    if (spaceAbove > spaceBelow && spaceAbove >= PANEL_MAX_HEIGHT_PX) return "above"
    if (spaceBelow >= spaceAbove) return "below"
    return "above"
}

function updatePanelPosition() {
    const el = triggerRef.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 4
    const vh = globalThis.innerHeight
    const placement = resolvePlacement(r, gap)
    resolvedPanelPlacement.value = placement
    if (placement === "above") {
        panelStyle.value = {
            top: "auto",
            bottom: `${vh - r.top + gap}px`,
            left: `${r.left}px`,
            width: `${r.width}px`,
        }
    } else {
        panelStyle.value = {
            top: `${r.bottom + gap}px`,
            bottom: "auto",
            left: `${r.left}px`,
            width: `${r.width}px`,
        }
    }
}

function syncHighlightToValue() {
    const opts = options.value
    const v = modelValue.value
    const idx = opts.findIndex((o) => o.value === v)
    if (idx >= 0 && !opts[idx]?.disabled) {
        highlightedIndex.value = idx
        return
    }
    const first = opts.findIndex((o) => !o.disabled)
    highlightedIndex.value = first >= 0 ? first : 0
}

function moveHighlight(delta: number) {
    const opts = options.value
    const n = opts.length
    if (!n) return
    let idx = highlightedIndex.value
    for (let s = 0; s < n; s++) {
        idx = (idx + delta + n) % n
        if (!opts[idx]?.disabled) {
            highlightedIndex.value = idx
            return
        }
    }
}

function toggle() {
    if (disabled.value) return
    open.value = !open.value
}

function selectIndex(i: number) {
    const opt = options.value[i]
    if (!opt || opt.disabled) return
    modelValue.value = opt.value
    open.value = false
    nextTick(() => triggerRef.value?.focus())
}

function onOptionMouseDown(i: number) {
    if (options.value[i]?.disabled) return
    selectIndex(i)
}

function onOptionMouseEnter(i: number) {
    if (options.value[i]?.disabled) return
    highlightedIndex.value = i
}

function onTriggerKeydown(e: KeyboardEvent) {
    if (disabled.value) return
    if (e.key === "Escape") {
        if (open.value) {
            e.preventDefault()
            open.value = false
        }
        return
    }
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (open.value) selectIndex(highlightedIndex.value)
        else open.value = true
        return
    }
    if (e.key === "ArrowDown") {
        e.preventDefault()
        if (!open.value) open.value = true
        else moveHighlight(1)
        return
    }
    if (e.key === "ArrowUp") {
        e.preventDefault()
        if (!open.value) open.value = true
        else moveHighlight(-1)
    }
}

function onPanelKeydown(e: KeyboardEvent) {
    if (e.key === "Tab") {
        open.value = false
        return
    }
    if (e.key === "Escape") {
        e.preventDefault()
        open.value = false
        triggerRef.value?.focus()
        return
    }
    if (e.key === "ArrowDown") {
        e.preventDefault()
        moveHighlight(1)
    }
    if (e.key === "ArrowUp") {
        e.preventDefault()
        moveHighlight(-1)
    }
    if (e.key === "Enter") {
        e.preventDefault()
        selectIndex(highlightedIndex.value)
    }
}

function onWindowUpdate() {
    if (open.value) updatePanelPosition()
}

onClickOutside(triggerRef, (ev) => {
    const t = ev.target as Node
    if (unrefElement(panelRef)?.contains(t)) return
    open.value = false
})

watch(open, async (v) => {
    if (v) {
        await nextTick()
        updatePanelPosition()
        syncHighlightToValue()
        await nextTick()
        unrefElement(panelRef)?.focus({ preventScroll: true })
    }
})

watch(highlightedIndex, async () => {
    if (!open.value) return
    await nextTick()
    document.getElementById(`${listboxId}-opt-${highlightedIndex.value}`)?.scrollIntoView({ block: "nearest" })
})

watch(
    options,
    () => {
        if (open.value) syncHighlightToValue()
    },
    { deep: true },
)

onMounted(() => {
    window.addEventListener("scroll", onWindowUpdate, true)
    window.addEventListener("resize", onWindowUpdate)
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onWindowUpdate, true)
    window.removeEventListener("resize", onWindowUpdate)
})

const displayLabel = computed(() => {
    const v = modelValue.value
    if (v === undefined || v === "") return null
    return options.value.find((o) => o.value === v)?.label ?? v
})

const labelClass = computed(() =>
    selectLabelClasses(
        displayLabel.value !== null,
        placeholderRef.value.length > 0,
        disabled.value === true,
    ),
)

const triggerText = computed(() => displayLabel.value ?? placeholderRef.value)

function setTriggerRef(el: HTMLElement | null) {
    triggerRef.value = el
}

function setPanelRef(el: HTMLElement | null) {
    panelRef.value = el
}
</script>

<template>

    <div :class="cn('relative inline-flex min-w-0', props.class ?? 'w-min')">
         <SelectTrigger
            :listbox-id="listboxId"
            :open="open"
            :disabled="disabled"
            :label-class="labelClass"
            :label-text="triggerText"
            :set-trigger-ref="setTriggerRef"
            :class="props.class"
            :toggle="toggle"
            :on-trigger-keydown="onTriggerKeydown"
        /> <SelectList
            :open="open"
            :listbox-id="listboxId"
            :set-panel-ref="setPanelRef"
            :panel-style="panelStyle"
            :panel-placement="resolvedPanelPlacement"
            :options="options"
            :model-value="modelValue"
            :highlighted-index="highlightedIndex"
            :on-panel-keydown="onPanelKeydown"
            :on-option-mouse-down="onOptionMouseDown"
            :on-option-mouse-enter="onOptionMouseEnter"
        />
    </div>

</template>

