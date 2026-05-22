<script setup lang="ts">
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import { categoryOptions, unitOptions } from "@/modules/waste/lib/wasteDisplayLabels"
import CreateWasteModal from "@/modules/waste/views/components/CreateWasteModal.vue"
import DeleteWasteModal from "@/modules/waste/views/components/DeleteWasteModal.vue"
import EditWasteModal from "@/modules/waste/views/components/EditWasteModal.vue"

defineProps<{
    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    wasteForEdit: WasteListItem | null
    deleteWasteName: string | undefined
}>()

const emit = defineEmits<{
    "update:isCreateModalOpen": [value: boolean]
    "update:isEditModalOpen": [value: boolean]
    "update:isDeleteModalOpen": [value: boolean]
    create: [payload: WasteUpsertDraft]
    save: [payload: WasteUpsertDraft]
    confirmDelete: []
}>()
</script>

<template>
    <CreateWasteModal
        :model-value="isCreateModalOpen"
        :category-options="[...categoryOptions]"
        :unit-options="[...unitOptions]"
        @update:model-value="emit('update:isCreateModalOpen', $event)"
        @create="emit('create', $event)"
    />
    <EditWasteModal
        :model-value="isEditModalOpen"
        :waste="wasteForEdit"
        :category-options="[...categoryOptions]"
        :unit-options="[...unitOptions]"
        @update:model-value="emit('update:isEditModalOpen', $event)"
        @save="emit('save', $event)"
    />
    <DeleteWasteModal
        :model-value="isDeleteModalOpen"
        :waste-name="deleteWasteName"
        @update:model-value="emit('update:isDeleteModalOpen', $event)"
        @confirm="emit('confirmDelete')"
    />
</template>
