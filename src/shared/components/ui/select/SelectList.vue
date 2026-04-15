<script setup lang="ts">
	import type { ComponentPublicInstance } from "vue"
	import { SELECT_PANEL_LAYOUT } from "./design"
	import type { SelectOption } from "./types"
	import SelectOptionRow from "./SelectOptionRow.vue"

	const props = defineProps<{
		open: boolean
		listboxId: string
		setPanelRef: (el: HTMLElement | null) => void
		panelStyle: Record<string, string>
		options: SelectOption[]
		modelValue: string | undefined
		highlightedIndex: number
		onPanelKeydown: (e: KeyboardEvent) => void
		onOptionMouseDown: (i: number) => void
	}>()

	function onPanelRef(el: Element | ComponentPublicInstance | null) {
		const node = el && "$el" in el ? (el.$el as HTMLElement | undefined) : (el as HTMLElement | null)
		props.setPanelRef(node instanceof HTMLElement ? node : null)
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
				:aria-activedescendant="`${listboxId}-opt-${highlightedIndex}`"
				:class="SELECT_PANEL_LAYOUT"
				:style="panelStyle"
				@keydown="onPanelKeydown">
				<SelectOptionRow
					v-for="(opt, i) in options"
					:key="opt.value"
					:opt="opt"
					:index="i"
					:listbox-id="listboxId"
					:selected="modelValue === opt.value"
					:highlighted="highlightedIndex === i"
					:on-option-mouse-down="onOptionMouseDown" />
			</div>
		</Transition>
	</Teleport>
</template>
