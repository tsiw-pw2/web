<script setup lang="ts">
	import type { BeachListItem } from "@/modules/beaches/types/list"
	import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
	import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
	import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
	import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

	const props = defineProps<{
		items: BeachListItem[]
	}>()

	const emit = defineEmits<{
		(e: "edit", beachId: string): void
		(e: "delete", beachId: string): void
	}>()

	const districtLabel: Record<string, string> = {
		braganca: "Bragança",
		porto: "Porto",
		braga: "Braga",
		lisboa: "Lisboa",
		faro: "Faro",
	}

	function labelForDistrict(code: string) {
		return districtLabel[code] ?? code
	}
</script>

<template>
	<DataTableScrollWrap>
		<table class="w-full min-w-[640px] border-collapse text-left">
			<thead>
				<tr class="border-b border-neutral-200">
					<DataTableTh>Nome</DataTableTh>
					<DataTableTh>Município</DataTableTh>
					<DataTableTh>Distrito</DataTableTh>
					<DataTableTh :padding-end="false" />
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in props.items"
					:key="row.id"
					class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
					<DataTableTd emphasis>{{ row.name }}</DataTableTd>
					<DataTableTd>{{ row.municipality }}</DataTableTd>
					<DataTableTd>{{ labelForDistrict(row.district) }}</DataTableTd>
					<DataTableActionsCell
						:row-id="row.id"
						@edit="(id: string) => emit('edit', id)"
						@delete="(id: string) => emit('delete', id)" />
				</tr>
			</tbody>
		</table>
	</DataTableScrollWrap>
</template>
