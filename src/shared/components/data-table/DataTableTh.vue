<script setup lang="ts">
	import { cn } from "@/shared/lib/utils"

	const props = withDefaults(
		defineProps<{
			class?: string
			paddingEnd?: boolean
		}>(),
		{
			paddingEnd: true,
		},
	)
</script>

<template>
	<th :class="cn('py-2 text-xs font-medium leading-4 text-neutral-500', props.paddingEnd && 'pe-4', props.class)">
		<slot />
	</th>
</template>
