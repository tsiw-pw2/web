<script setup lang="ts">
	import type { CampaignListItem } from "@/modules/campaigns/types/list"
	import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
	import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
	import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
	import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

	const props = defineProps<{
		items: CampaignListItem[]
	}>()

	const emit = defineEmits<{
		(e: "select", campaignId: string): void
		(e: "edit", campaignId: string): void
		(e: "delete", campaignId: string): void
	}>()

	function onRowClick(id: string) {
		emit("select", id)
	}
</script>

<template>
	<DataTableScrollWrap>
		<table class="w-full min-w-[920px] border-collapse text-left">
			<thead>
				<tr class="border-b border-neutral-200">
					<DataTableTh>Título</DataTableTh>
					<DataTableTh>Município</DataTableTh>
					<DataTableTh>Praia</DataTableTh>
					<DataTableTh>Data início</DataTableTh>
					<DataTableTh>Data fim</DataTableTh>
					<DataTableTh :padding-end="false" />
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in props.items"
					:key="row.id"
					class="cursor-pointer border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
					@click="onRowClick(row.id)">
					<DataTableTd emphasis>{{ row.title }}</DataTableTd>
					<DataTableTd>{{ row.municipality }}</DataTableTd>
					<DataTableTd truncate>{{ row.beach }}</DataTableTd>
					<DataTableTd>{{ row.startDate }}</DataTableTd>
					<DataTableTd>{{ row.endDate }}</DataTableTd>
					<DataTableActionsCell
						:row-id="row.id"
						@edit="(id: string) => emit('edit', id)"
						@delete="(id: string) => emit('delete', id)" />
				</tr>
			</tbody>
		</table>
	</DataTableScrollWrap>
</template>
