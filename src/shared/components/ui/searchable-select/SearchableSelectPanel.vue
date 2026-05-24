<script setup lang="ts">
import type { ComponentPublicInstance } from "vue"
import SearchMagnifierIcon from "@/shared/components/icons/SearchMagnifierIcon.vue"
import { cn } from "@/shared/lib/utils"
import { SELECT_PANEL_LAYOUT } from "@/shared/components/ui/select/design"
import SearchableSelectCreateRow from "./SearchableSelectCreateRow.vue"
import SearchableSelectOptionRow from "./SearchableSelectOptionRow.vue"
import type { SearchableSelectOption } from "./types"

const props = defineProps<{
    open: boolean
    listboxId: string
    setPanelRef: (el: HTMLElement | null) => void
    panelStyle: Record<string, string>
    panelPlacement: "below" | "above"
    filteredOptions: SearchableSelectOption[]
    modelValue: string | undefined
    highlightedIndex: number
    query: string
    searchQuery: string
    showCreateRow: boolean
    createRowName: string
    creating: boolean
    onPanelKeydown: (e: KeyboardEvent) => void
    onSearchKeydown: (e: KeyboardEvent) => void
    onSearchInput: (value: string) => void
    onOptionMouseDown: (i: number) => void
    onOptionMouseEnter: (i: number) => void
    onCreateMouseDown: () => void
    onCreateMouseEnter: () => void
    setSearchInputRef: (el: HTMLInputElement | null) => void
}>()

function onPanelRef(el: Element | ComponentPublicInstance | null) {
    const node = el && "$el" in el ? (el.$el as HTMLElement | undefined) : (el as HTMLElement | null)
    props.setPanelRef(node instanceof HTMLElement ? node : null)
}

function onSearchRef(el: Element | ComponentPublicInstance | null) {
    const node = el && "$el" in el ? (el.$el as HTMLElement | undefined) : (el as HTMLInputElement | null)
    props.setSearchInputRef(node instanceof HTMLInputElement ? node : null)
}
</script>

<template>
    <Teleport to="body">
        <Transition name="select-panel">
            <div
                v-if="open"
                :ref="onPanelRef"
                role="listbox"
                :id="listboxId"
                tabindex="-1"
                :aria-activedescendant="
                    showCreateRow && highlightedIndex === filteredOptions.length
                        ? `${listboxId}-opt-${filteredOptions.length}`
                        : `${listboxId}-opt-${highlightedIndex}`
                "
                :class="cn(SELECT_PANEL_LAYOUT, 'flex max-h-60 flex-col overflow-hidden p-0', panelPlacement === 'below' ? 'origin-top' : 'origin-bottom')"
                :style="panelStyle"
                @keydown="onPanelKeydown"
            >
                <div class="border-b border-neutral-200 px-2 py-1.5">
                    <div class="flex items-center gap-2">
                        <SearchMagnifierIcon />
                        <input
                            :ref="onSearchRef"
                            type="text"
                            :value="searchQuery"
                            placeholder="Procurar…"
                            class="min-w-0 flex-1 bg-transparent text-sm font-medium leading-5 text-neutral-900 outline-none placeholder:text-neutral-500"
                            :disabled="creating"
                            @input="onSearchInput(($event.target as HTMLInputElement).value)"
                            @keydown="onSearchKeydown"
                        />
                    </div>
                </div>
                <div class="min-h-0 flex-1 overflow-auto p-1">
                    <p v-if="creating" class="px-2 py-1.5 text-sm text-neutral-500">A criar…</p>
                    <template v-else>
                        <SearchableSelectOptionRow
                            v-for="(opt, i) in filteredOptions"
                            :key="opt.value"
                            :opt="opt"
                            :index="i"
                            :listbox-id="listboxId"
                            :selected="modelValue === opt.value"
                            :highlighted="highlightedIndex === i"
                            :query="query"
                            :on-option-mouse-down="onOptionMouseDown"
                            :on-option-mouse-enter="onOptionMouseEnter"
                        />
                        <div
                            v-if="showCreateRow && filteredOptions.length > 0"
                            class="my-1 border-t border-neutral-200"
                            role="separator"
                        />
                        <SearchableSelectCreateRow
                            v-if="showCreateRow"
                            :listbox-id="listboxId"
                            :create-index="filteredOptions.length"
                            :name="createRowName"
                            :highlighted="highlightedIndex === filteredOptions.length"
                            :on-create-mouse-down="onCreateMouseDown"
                            :on-create-mouse-enter="onCreateMouseEnter"
                        />
                        <p
                            v-if="filteredOptions.length === 0 && !showCreateRow"
                            class="px-2 py-1.5 text-sm text-neutral-500"
                        >
                            Sem resultados.
                        </p>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
