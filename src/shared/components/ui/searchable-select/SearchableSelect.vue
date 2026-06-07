<script lang="ts">
export type { SearchableSelectOption } from "./types"
</script>

<script setup lang="ts">
import { onClickOutside, unrefElement } from "@vueuse/core"
import type { HTMLAttributes } from "vue"
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRef, useId, watch } from "vue"
import { hasExactLabelMatch, optionMatchesQuery } from "@/shared/lib/matchHighlight"
import { cn } from "@/shared/lib/utils"
import { selectLabelClasses } from "@/shared/components/ui/select/design"
import SelectTrigger from "@/shared/components/ui/select/SelectTrigger.vue"
import SearchableSelectPanel from "./SearchableSelectPanel.vue"
import type { SearchableSelectOption } from "./types"

const PANEL_MAX_HEIGHT_PX = 240

const props = withDefaults(
    defineProps<{
        id?: string
        options: SearchableSelectOption[]
        placeholder?: string
        disabled?: boolean
        class?: HTMLAttributes["class"]
        panelPlacement?: "auto" | "below" | "above"
        creatable?: boolean
        creating?: boolean
        filterMode?: boolean
        clearLabel?: string
    }>(),
    {
        placeholder: "",
        panelPlacement: "auto",
        creatable: false,
        creating: false,
        filterMode: false,
    },
)

const modelValue = defineModel<string | undefined>()

const emit = defineEmits<{
    "create-option": [name: string]
}>()

const options = toRef(props, "options")
const disabled = toRef(props, "disabled")
const placeholderRef = toRef(props, "placeholder")

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref("")
const highlightedIndex = ref(0)

const listboxId = useId()

const panelStyle = ref<Record<string, string>>({ top: "0px", left: "0px", width: "0px" })
const resolvedPanelPlacement = ref<"below" | "above">("below")

const filteredOptions = computed(() =>
    options.value.filter((opt) => optionMatchesQuery(opt.label, searchQuery.value)),
)

const createRowName = computed(() => searchQuery.value.trim())

const showCreateRow = computed(() => {
    if (!props.creatable || props.creating) return false
    const name = createRowName.value
    if (!name) return false
    return !hasExactLabelMatch(
        options.value.map((opt) => opt.label),
        name,
    )
})

const navigableCount = computed(() => filteredOptions.value.length + (showCreateRow.value ? 1 : 0))

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
    const opts = filteredOptions.value
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
    const n = navigableCount.value
    if (!n) return
    let idx = highlightedIndex.value
    for (let s = 0; s < n; s++) {
        idx = (idx + delta + n) % n
        const opt = filteredOptions.value[idx]
        if (idx < filteredOptions.value.length) {
            if (!opt?.disabled) {
                highlightedIndex.value = idx
                return
            }
        } else if (showCreateRow.value) {
            highlightedIndex.value = idx
            return
        }
    }
}

function closePanel() {
    open.value = false
}

function toggle() {
    if (disabled.value || props.creating) return
    open.value = !open.value
}

function selectIndex(i: number) {
    const opt = filteredOptions.value[i]
    if (!opt || opt.disabled) return
    modelValue.value = opt.value
    closePanel()
    nextTick(() => triggerRef.value?.focus())
}

function selectCreateRow() {
    const name = createRowName.value
    if (!name || !showCreateRow.value) return
    closePanel()
    searchQuery.value = ""
    emit("create-option", name)
    nextTick(() => triggerRef.value?.focus())
}

function activateHighlighted() {
    if (showCreateRow.value && highlightedIndex.value === filteredOptions.value.length) {
        selectCreateRow()
        return
    }
    selectIndex(highlightedIndex.value)
}

function onOptionMouseDown(i: number) {
    if (filteredOptions.value[i]?.disabled) return
    selectIndex(i)
}

function onOptionMouseEnter(i: number) {
    if (filteredOptions.value[i]?.disabled) return
    highlightedIndex.value = i
}

function onCreateMouseDown() {
    selectCreateRow()
}

function onCreateMouseEnter() {
    highlightedIndex.value = filteredOptions.value.length
}

function onSearchInput(value: string) {
    searchQuery.value = value
    syncHighlightToValue()
}

function onTriggerKeydown(e: KeyboardEvent) {
    if (disabled.value || props.creating) return
    if (e.key === "Escape") {
        if (open.value) {
            e.preventDefault()
            closePanel()
        }
        return
    }
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (open.value) activateHighlighted()
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

function onSearchKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
        e.preventDefault()
        if (navigableCount.value > 0) {
            highlightedIndex.value = 0
            panelRef.value?.focus({ preventScroll: true })
        }
        return
    }
    if (e.key === "ArrowUp") {
        e.preventDefault()
        if (navigableCount.value > 0) {
            highlightedIndex.value = navigableCount.value - 1
            panelRef.value?.focus({ preventScroll: true })
        }
        return
    }
    if (e.key === "Enter") {
        e.preventDefault()
        activateHighlighted()
        return
    }
    if (e.key === "Escape") {
        e.preventDefault()
        closePanel()
        triggerRef.value?.focus()
    }
}

function onPanelKeydown(e: KeyboardEvent) {
    if (e.key === "Tab") {
        closePanel()
        return
    }
    if (e.key === "Escape") {
        e.preventDefault()
        closePanel()
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
        activateHighlighted()
    }
}

function onWindowUpdate() {
    if (open.value) updatePanelPosition()
}

onClickOutside(triggerRef, (ev) => {
    const t = ev.target as Node
    if (unrefElement(panelRef)?.contains(t)) return
    closePanel()
})

watch(open, async (v) => {
    if (v) {
        searchQuery.value = ""
        await nextTick()
        updatePanelPosition()
        syncHighlightToValue()
        await nextTick()
        searchInputRef.value?.focus({ preventScroll: true })
    }
})

watch(searchQuery, () => {
    if (open.value) syncHighlightToValue()
})

watch(
    () => props.options,
    () => {
        if (open.value) syncHighlightToValue()
    },
    { deep: true },
)

watch(highlightedIndex, async () => {
    if (!open.value) return
    await nextTick()
    document.getElementById(`${listboxId}-opt-${highlightedIndex.value}`)?.scrollIntoView({ block: "nearest" })
})

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
        disabled.value === true || props.creating === true,
    ),
)

const triggerText = computed(() => displayLabel.value ?? placeholderRef.value)

const showClear = computed(() => props.filterMode === true && displayLabel.value !== null)

function clearSelection() {
    if (disabled.value || props.creating) return
    open.value = false
    modelValue.value = ""
    searchQuery.value = ""
    nextTick(() => triggerRef.value?.querySelector<HTMLButtonElement>('[role="combobox"]')?.focus())
}

function setTriggerRef(el: HTMLElement | null) {
    triggerRef.value = el
}

function setPanelRef(el: HTMLElement | null) {
    panelRef.value = el
}

function setSearchInputRef(el: HTMLInputElement | null) {
    searchInputRef.value = el
}
</script>

<template>
    <div :class="cn('relative inline-flex min-w-0', props.class ?? 'w-min')">
        <SelectTrigger
            :listbox-id="listboxId"
            :trigger-id="props.id"
            :open="open"
            :disabled="disabled || creating"
            :label-class="labelClass"
            :label-text="triggerText"
            :show-clear="showClear"
            :clear-label="props.clearLabel"
            :set-trigger-ref="setTriggerRef"
            :toggle="toggle"
            :on-clear="clearSelection"
            :on-trigger-keydown="onTriggerKeydown"
        />
        <SearchableSelectPanel
            :open="open"
            :listbox-id="listboxId"
            :set-panel-ref="setPanelRef"
            :panel-style="panelStyle"
            :panel-placement="resolvedPanelPlacement"
            :filtered-options="filteredOptions"
            :model-value="modelValue"
            :highlighted-index="highlightedIndex"
            :query="searchQuery"
            :search-query="searchQuery"
            :show-create-row="showCreateRow"
            :create-row-name="createRowName"
            :creating="creating"
            :on-panel-keydown="onPanelKeydown"
            :on-search-keydown="onSearchKeydown"
            :on-search-input="onSearchInput"
            :on-option-mouse-down="onOptionMouseDown"
            :on-option-mouse-enter="onOptionMouseEnter"
            :on-create-mouse-down="onCreateMouseDown"
            :on-create-mouse-enter="onCreateMouseEnter"
            :set-search-input-ref="setSearchInputRef"
        />
    </div>
</template>
