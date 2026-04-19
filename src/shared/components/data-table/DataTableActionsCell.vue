<script setup lang="ts">
	import EditPencilIcon from "@/shared/components/icons/EditPencilIcon.vue"
	import TrashBucketIcon from "@/shared/components/icons/TrashBucketIcon.vue"

	const props = withDefaults(
		defineProps<{
			rowId: string
			showEdit?: boolean
			showDelete?: boolean
			editLabel?: string
			deleteLabel?: string
		}>(),
		{
			showEdit: true,
			showDelete: true,
			editLabel: "Editar",
			deleteLabel: "Apagar",
		},
	)

	const emit = defineEmits<{
		edit: [rowId: string]
		delete: [rowId: string]
	}>()

	function onEdit(e: MouseEvent) {
		e.preventDefault()
		e.stopPropagation()
		emit("edit", props.rowId)
	}

	function onDelete(e: MouseEvent) {
		e.preventDefault()
		e.stopPropagation()
		emit("delete", props.rowId)
	}
</script>

<template>
	<td class="py-3">
		<div class="flex items-center justify-end gap-3 pe-2">
			<button
				v-if="props.showEdit"
				type="button"
				class="text-neutral-500 outline-none enabled:hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-neutral-200"
				:aria-label="props.editLabel"
				@click="onEdit">
				<EditPencilIcon />
			</button>
			<button
				v-if="props.showDelete"
				type="button"
				class="text-neutral-500 outline-none enabled:hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-neutral-200"
				:aria-label="props.deleteLabel"
				@click="onDelete">
				<TrashBucketIcon />
			</button>
		</div>
	</td>
</template>
