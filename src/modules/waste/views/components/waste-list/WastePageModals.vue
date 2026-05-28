<script setup lang="ts">
import type { WasteListItem, WasteUpsertDraft } from "@/modules/waste/types/list"
import CreateWasteModal from "@/modules/waste/views/components/CreateWasteModal.vue"
import DeleteWasteModal from "@/modules/waste/views/components/DeleteWasteModal.vue"
import EditWasteModal from "@/modules/waste/views/components/EditWasteModal.vue"

const props = defineProps<{
    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    editWasteId: string | null
    wasteForEdit: WasteListItem | null
    deleteWasteName: string | undefined
    categoryOptions: { value: string; label: string }[]
    categoriesLoading: boolean
    categoryCreating: boolean
    isAdmin: boolean
    createCategoryHandler: (name: string) => Promise<string | undefined>
    isCreateSubmitting: boolean
    isEditSubmitting: boolean
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
        :model-value="props.isCreateModalOpen"
        :category-options="props.categoryOptions"
        :categories-loading="props.categoriesLoading"
        :category-creating="props.categoryCreating"
        :is-admin="props.isAdmin"
        :create-category-handler="props.createCategoryHandler"
        :submitting="props.isCreateSubmitting"
        @update:model-value="emit('update:isCreateModalOpen', $event)"
        @create="emit('create', $event)"
    />
    <EditWasteModal
        :model-value="props.isEditModalOpen"
        :waste-id="props.editWasteId"
        :waste="props.wasteForEdit"
        :category-options="props.categoryOptions"
        :categories-loading="props.categoriesLoading"
        :category-creating="props.categoryCreating"
        :is-admin="props.isAdmin"
        :create-category-handler="props.createCategoryHandler"
        :submitting="props.isEditSubmitting"
        @update:model-value="emit('update:isEditModalOpen', $event)"
        @save="emit('save', $event)"
    />
    <DeleteWasteModal
        :model-value="props.isDeleteModalOpen"
        :waste-name="props.deleteWasteName"
        @update:model-value="emit('update:isDeleteModalOpen', $event)"
        @confirm="emit('confirmDelete')"
    />
</template>
