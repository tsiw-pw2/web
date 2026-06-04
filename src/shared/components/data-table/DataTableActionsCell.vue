<script setup lang="ts">
import EditPencilIcon from "@/shared/components/icons/EditPencilIcon.vue"
import TrashBucketIcon from "@/shared/components/icons/TrashBucketIcon.vue"
import DataTableActionButton from "./DataTableActionButton.vue"

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

// Emite o evento de edição.
function onEdit(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    emit("edit", props.rowId)
}

// Emite o evento de eliminação.
function onDelete(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    emit("delete", props.rowId)
}
</script>

<template>
    <td class="relative h-10 max-h-10 px-3 py-0 align-middle">
        <div class="flex h-10 max-h-10 items-center justify-end gap-1.5">
            <DataTableActionButton
                v-if="props.showEdit"
                variant="edit"
                :ariaLabel="props.editLabel"
                @click="onEdit"
            >
                <EditPencilIcon />
            </DataTableActionButton>
            <DataTableActionButton
                v-if="props.showDelete"
                variant="delete"
                :ariaLabel="props.deleteLabel"
                @click="onDelete"
            >
                <TrashBucketIcon />
            </DataTableActionButton>
        </div>
    </td>
</template>
