<script setup lang="ts">
	import type { HTMLAttributes } from "vue"
	import DashboardPanel from "./DashboardPanel.vue"
	import DashboardPanelHeader from "./DashboardPanelHeader.vue"
	import type { DashboardKeyValueRow } from "../types"

	const props = defineProps<{
		title: string
		rows: DashboardKeyValueRow[]
		class?: HTMLAttributes["class"]
		moreHref?: string
		moreLabel?: string
	}>()
</script>

<template>
	<DashboardPanel :class="props.class">
		<DashboardPanelHeader :title="title" :more-href="moreHref" :more-label="moreLabel">
			<template #icon>
				<slot name="icon" />
			</template>
		</DashboardPanelHeader>
		<div class="flex flex-col gap-2">
			<div v-for="(row, i) in rows" :key="i" class="flex items-center gap-4">
				<p class="w-full text-base font-medium leading-6 text-neutral-500">{{ row.label }}</p>
				<span class="whitespace-nowrap text-base font-medium leading-6 text-neutral-950 tabular-nums">
					{{ row.value }}
				</span>
			</div>
		</div>
	</DashboardPanel>
</template>
