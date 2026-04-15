<script setup lang="ts">
	import type { HTMLAttributes } from "vue"
	import { cn } from "@/shared/lib/utils"

	const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
	<div :class="cn('space-y-4 rounded-lg bg-white p-4 shadow-card', props.class)">
		<slot />
	</div>
</template>
