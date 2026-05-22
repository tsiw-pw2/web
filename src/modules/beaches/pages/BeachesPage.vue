<script setup lang="ts">
import { useBeachesPageState } from "@/modules/beaches/composables/beaches-list/useBeachesPageState"
import BeachesPageContent from "@/modules/beaches/views/components/beaches-list/BeachesPageContent.vue"
import BeachesPageHeader from "@/modules/beaches/views/components/beaches-list/BeachesPageHeader.vue"
import BeachesPageModals from "@/modules/beaches/views/components/beaches-list/BeachesPageModals.vue"
import type { BeachUpsertDraft } from "@/modules/beaches/types/list"

const page = useBeachesPageState()

const {
    loading,
    error,
    beaches,
    page: currentPage,
    pageSize,
    total,
    reload,
    goToPrevPage,
    goToNextPage,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editBeachId,
    beachForEdit,
    deleteBeachName,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    createBeachWithToast,
    saveBeachWithToast,
    confirmDeleteBeach,
    removeBeach,
} = page
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <BeachesPageHeader class="shrink-0" @create="openCreateModal" />
        <div class="flex min-h-0 flex-1 flex-col">
        <BeachesPageContent
            :loading="loading"
            :error="error"
            :beaches="beaches"
            :page="currentPage"
            :page-size="pageSize"
            :total="total"
            @retry="reload"
            @create="openCreateModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @prev="goToPrevPage"
            @next="goToNextPage"
        />
        </div>
    </div>
    <BeachesPageModals
        v-model:is-create-modal-open="isCreateModalOpen"
        v-model:is-edit-modal-open="isEditModalOpen"
        v-model:is-delete-modal-open="isDeleteModalOpen"
        :beach-for-edit="beachForEdit"
        :delete-beach-name="deleteBeachName"
        @create="createBeachWithToast"
        @save="(payload: BeachUpsertDraft) => editBeachId && saveBeachWithToast(editBeachId, payload)"
        @confirm-delete="() => confirmDeleteBeach(removeBeach)"
    />
</template>
