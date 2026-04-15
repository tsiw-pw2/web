<script setup lang="ts">
	import type { ComponentPublicInstance, HTMLAttributes } from "vue"
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
		@keydown="onTriggerKeydown">
		<span :class="labelClass">{{ labelText }}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			class="size-4 shrink-0 text-neutral-500"
			aria-hidden="true">
			<path
				d="M5.3335 7.66699L8.00016 10.3337L10.6668 7.66699"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round" />
		</svg>
	</button>
</template>
