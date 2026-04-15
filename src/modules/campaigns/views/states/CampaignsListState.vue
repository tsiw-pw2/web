<script setup lang="ts">
	import type { CampaignListItem } from "@/modules/campaigns/composables/useCampaignsPageData"

	defineProps<{
		items: CampaignListItem[]
	}>()
</script>

<template>
	<div class="flex min-h-0 w-full flex-1 flex-col overflow-x-auto">
		<table class="w-full min-w-0 border-collapse text-left text-sm leading-5">
			<thead>
				<tr>
					<th class="py-2 pe-4 font-medium text-neutral-950">Campanha</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in items" :key="row.id">
					<td class="py-3 pe-4 text-neutral-950">{{ row.title }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
