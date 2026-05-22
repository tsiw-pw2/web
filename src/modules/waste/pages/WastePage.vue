<script setup lang="ts">
import { useWastePageState } from "@/modules/waste/composables/waste-list/useWastePageState"
import WastePageContent from "@/modules/waste/views/components/waste-list/WastePageContent.vue"
import WastePageHeader from "@/modules/waste/views/components/waste-list/WastePageHeader.vue"
import WastePageModals from "@/modules/waste/views/components/waste-list/WastePageModals.vue"
import type { WasteUpsertDraft } from "@/modules/waste/types/list"

const page = useWastePageState()

const {
    loading,
    error,
    items,
    page: currentPage,
    pageSize,
    total,
    reload,
    goToPrevPage,
    goToNextPage,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editWasteId,
    wasteForEdit,
    deleteWasteName,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    createWasteWithToast,
    saveWasteWithToast,
    confirmDeleteWaste,
    removeWaste,
} = page
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <WastePageHeader class="shrink-0" @create="openCreateModal" />
        <div class="flex min-h-0 flex-1 flex-col">
        <WastePageContent
            :loading="loading"
            :error="error"
            :items="items"
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
    <WastePageModals
        v-model:is-create-modal-open="isCreateModalOpen"
        v-model:is-edit-modal-open="isEditModalOpen"
        v-model:is-delete-modal-open="isDeleteModalOpen"
        :waste-for-edit="wasteForEdit"
        :delete-waste-name="deleteWasteName"
        @create="createWasteWithToast"
        @save="(payload: WasteUpsertDraft) => editWasteId && saveWasteWithToast(editWasteId, payload)"
        @confirm-delete="() => confirmDeleteWaste(removeWaste)"
    />
</template>
