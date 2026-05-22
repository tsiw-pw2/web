<script setup lang="ts">
import type { BeachListItem, BeachUpsertDraft } from "@/modules/beaches/types/list"
import CreateBeachModal from "@/modules/beaches/views/components/CreateBeachModal.vue"
import DeleteBeachModal from "@/modules/beaches/views/components/DeleteBeachModal.vue"
import EditBeachModal from "@/modules/beaches/views/components/EditBeachModal.vue"

defineProps<{
    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    beachForEdit: BeachListItem | null
    deleteBeachName: string | undefined
}>()

const emit = defineEmits<{
    "update:isCreateModalOpen": [value: boolean]
    "update:isEditModalOpen": [value: boolean]
    "update:isDeleteModalOpen": [value: boolean]
    create: [payload: BeachUpsertDraft]
    save: [payload: BeachUpsertDraft]
    confirmDelete: []
}>()
</script>

<template>
    <CreateBeachModal
        :model-value="isCreateModalOpen"
        @update:model-value="emit('update:isCreateModalOpen', $event)"
        @create="emit('create', $event)"
    />
    <EditBeachModal
        :model-value="isEditModalOpen"
        :beach="beachForEdit"
        @update:model-value="emit('update:isEditModalOpen', $event)"
        @save="emit('save', $event)"
    />
    <DeleteBeachModal
        :model-value="isDeleteModalOpen"
        :beach-name="deleteBeachName"
        @update:model-value="emit('update:isDeleteModalOpen', $event)"
        @confirm="emit('confirmDelete')"
    />
</template>
