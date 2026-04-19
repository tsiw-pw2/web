<script setup lang="ts">
	import type { WasteListItem } from "@/modules/waste/types/list"
	import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
	import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
	import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
	import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"

	const props = defineProps<{
		items: WasteListItem[]
	}>()

	const emit = defineEmits<{
		(e: "edit", wasteId: string): void
		(e: "delete", wasteId: string): void
	}>()

	const categoryLabel: Record<string, string> = {
		plastic: "Plástico",
		glass: "Vidro",
		metal: "Metal",
		paper: "Papel / cartão",
		organic: "Orgânico",
		other: "Outro",
	}

	const unitLabel: Record<string, string> = {
		kg: "kg",
		unit: "Unidade",
	}

	function labelCategory(code: string) {
		return categoryLabel[code] ?? code
	}

	function labelUnit(code: string) {
		return unitLabel[code] ?? code
	}
</script>

<template>
	<DataTableScrollWrap>
		<table class="w-full min-w-[640px] border-collapse text-left">
			<thead>
				<tr class="border-b border-neutral-200">
					<DataTableTh>Nome</DataTableTh>
					<DataTableTh>Categoria</DataTableTh>
					<DataTableTh>Unidade</DataTableTh>
					<DataTableTh :padding-end="false" />
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in props.items"
					:key="row.id"
					class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
					<DataTableTd emphasis>{{ row.name }}</DataTableTd>
					<DataTableTd>{{ labelCategory(row.category) }}</DataTableTd>
					<DataTableTd>{{ labelUnit(row.unit) }}</DataTableTd>
					<DataTableActionsCell
						:row-id="row.id"
						@edit="(id: string) => emit('edit', id)"
						@delete="(id: string) => emit('delete', id)" />
				</tr>
			</tbody>
		</table>
	</DataTableScrollWrap>
</template>
