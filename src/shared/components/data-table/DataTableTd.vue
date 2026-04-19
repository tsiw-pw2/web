<script setup lang="ts">
	import { cn } from "@/shared/lib/utils"

	const props = withDefaults(
		defineProps<{
			class?: string
			emphasis?: boolean
			paddingEnd?: boolean
			truncate?: boolean
		}>(),
		{
			emphasis: false,
			paddingEnd: true,
			truncate: false,
		},
	)
</script>

<template>
	<td
		:class="
			cn(
				'py-3 text-sm leading-5 text-neutral-950',
				props.emphasis && 'font-medium',
				props.paddingEnd && 'pe-4',
				props.class,
			)
		">
		<span v-if="props.truncate" class="block max-w-[420px] truncate">
			<slot />
		</span>
		<slot v-else />
	</td>
</template>
