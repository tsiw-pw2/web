<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title: string
			moreHref?: string
			moreLabel?: string
		}>(),
		{
			moreLabel: "Ver mais",
		},
	)
</script>

<template>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1">
			<slot name="icon" />
			<p class="text-base font-medium leading-6 text-neutral-950">{{ title }}</p>
		</div>
		<a
			v-if="props.moreHref"
			class="font-medium text-neutral-400 underline hover:text-neutral-600"
			:href="props.moreHref">
			{{ props.moreLabel }}
		</a>
	</div>
</template>
