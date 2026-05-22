<script setup lang="ts">
import type { CampaignCreateDraft, CampaignListItem } from "@/modules/campaigns/types/list"
import CreateCampaignModal from "@/modules/campaigns/views/components/CreateCampaignModal.vue"
import DeleteCampaignModal from "@/modules/campaigns/views/components/DeleteCampaignModal.vue"
import EditCampaignModal from "@/modules/campaigns/views/components/EditCampaignModal.vue"

defineProps<{
    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
    campaignForEdit: CampaignListItem | null
    deleteCampaignTitle: string | undefined
}>()

const emit = defineEmits<{
    "update:isCreateModalOpen": [value: boolean]
    "update:isEditModalOpen": [value: boolean]
    "update:isDeleteModalOpen": [value: boolean]
    create: [payload: CampaignCreateDraft]
    save: [payload: CampaignCreateDraft]
    confirmDelete: []
}>()
</script>

<template>
    <CreateCampaignModal
        :model-value="isCreateModalOpen"
        @update:model-value="emit('update:isCreateModalOpen', $event)"
        @create="emit('create', $event)"
    />
    <EditCampaignModal
        :model-value="isEditModalOpen"
        :campaign="campaignForEdit"
        @update:model-value="emit('update:isEditModalOpen', $event)"
        @save="emit('save', $event)"
    />
    <DeleteCampaignModal
        :model-value="isDeleteModalOpen"
        :campaign-title="deleteCampaignTitle"
        @update:model-value="emit('update:isDeleteModalOpen', $event)"
        @confirm="emit('confirmDelete')"
    />
</template>
