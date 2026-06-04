<script setup lang="ts">
import { ref } from "vue"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"
import { useWastePageState } from "@/modules/waste/composables/waste-list/useWastePageState"
import WasteListFiltersBar from "@/modules/waste/views/components/waste-list/WasteListFiltersBar.vue"
import WastePageContent from "@/modules/waste/views/components/waste-list/WastePageContent.vue"
import WastePageHeader from "@/modules/waste/views/components/waste-list/WastePageHeader.vue"
import WastePageModals from "@/modules/waste/views/components/waste-list/WastePageModals.vue"
import type { WasteUpsertDraft } from "@/modules/waste/types/list"

const page = useWastePageState()
const { canManage } = useCanManageCatalog()

const {
    loading,
    error,
    errorHint,
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
    categoryOptions,
    categoriesLoading,
    categoryCreating,
    isAdmin,
    createCategory,
    listFilters,
} = page

const {
    search: wasteSearch,
    units: wasteUnits,
    categories: wasteCategories,
    hasActiveFilters,
    clearAllFilters,
} = listFilters

const isCreateSubmitting = ref(false)
const isEditSubmitting = ref(false)

// Cria uma nova categoria de resíduo.
async function handleCreateCategory(name: string) {
    try {
        const category = await createCategory(name)
        return category.id
    } catch {
        return undefined
    }
}

// Cria um novo registo de resíduo.
async function handleCreate(payload: WasteUpsertDraft) {
    if (isCreateSubmitting.value) return
    isCreateSubmitting.value = true
    try {
        const ok = await createWasteWithToast(payload)
        if (ok) isCreateModalOpen.value = false
    } finally {
        isCreateSubmitting.value = false
    }
}

// Guarda as alterações do resíduo.
async function handleSave(payload: WasteUpsertDraft) {
    if (!editWasteId.value || isEditSubmitting.value) return
    isEditSubmitting.value = true
    try {
        const ok = await saveWasteWithToast(editWasteId.value, payload)
        if (ok) isEditModalOpen.value = false
    } finally {
        isEditSubmitting.value = false
    }
}
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <WastePageHeader class="shrink-0" @create="openCreateModal" />
        <WasteListFiltersBar
            v-model:search="wasteSearch"
            v-model:units="wasteUnits"
            v-model:categories="wasteCategories"
            :category-options="categoryOptions"
            class="shrink-0"
        />
        <div class="flex min-h-0 flex-1 flex-col">
            <WastePageContent
                :loading="loading"
                :error="error"
                :error-hint="errorHint"
                :items="items"
                :page="currentPage"
                :page-size="pageSize"
                :total="total"
                :has-active-filters="hasActiveFilters"
                @retry="reload"
                @create="openCreateModal"
                @clear-filters="clearAllFilters"
                @edit="openEditModal"
                @delete="openDeleteModal"
                @prev="goToPrevPage"
                @next="goToNextPage"
            />
        </div>
    </div>
    <WastePageModals
        v-if="canManage"
        v-model:is-create-modal-open="isCreateModalOpen"
        v-model:is-edit-modal-open="isEditModalOpen"
        v-model:is-delete-modal-open="isDeleteModalOpen"
        :edit-waste-id="editWasteId"
        :waste-for-edit="wasteForEdit"
        :category-options="categoryOptions"
        :categories-loading="categoriesLoading"
        :category-creating="categoryCreating"
        :is-admin="isAdmin"
        :create-category-handler="handleCreateCategory"
        :is-create-submitting="isCreateSubmitting"
        :is-edit-submitting="isEditSubmitting"
        :delete-waste-name="deleteWasteName"
        @create="handleCreate"
        @save="handleSave"
        @confirm-delete="() => confirmDeleteWaste(removeWaste)"
    />
</template>
