<script setup lang="ts">
	import { selectOptionClasses } from "./design"
	import type { SelectOption } from "./types"

	const props = defineProps<{
		opt: SelectOption
		index: number
		listboxId: string
		selected: boolean
		highlighted: boolean
		onOptionMouseDown: (i: number) => void
	}>()
</script>

<template>
	<div
		:id="`${listboxId}-opt-${index}`"
		role="option"
		:aria-selected="selected"
		:aria-disabled="opt.disabled || undefined"
		:class="selectOptionClasses(highlighted)"
		:data-disabled="opt.disabled ? '' : undefined"
		@mousedown.prevent="onOptionMouseDown(index)">
		<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
			<svg
				v-if="selected"
				class="size-4"
				aria-hidden="true"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16">
				<path
					d="M5.1665 8.70841L7.2915 10.8334L10.8332 5.16675"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round" />
			</svg>
		</span>
		<span class="block truncate">{{ opt.label }}</span>
	</div>
</template>
