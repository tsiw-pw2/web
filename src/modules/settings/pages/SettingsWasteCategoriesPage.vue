<script setup lang="ts">
import { useSettingsWasteCategoriesPageState } from "@/modules/settings/composables/settings-waste-categories/useSettingsWasteCategoriesPageState"
import SettingsWasteCategoriesInlineTable from "@/modules/settings/views/components/settings-waste-categories/SettingsWasteCategoriesInlineTable.vue"
import SettingsWasteCategoryDeleteModal from "@/modules/settings/views/components/settings-waste-categories/SettingsWasteCategoryDeleteModal.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"

const page = useSettingsWasteCategoriesPageState()

const {
    profile,
    categories,
    page: categoriesPage,
    pageSize,
    total,
    loading,
    error,
    goToPrevPage,
    goToNextPage,
    reload,
    isCreating,
    newCategoryName,
    editingCategoryId,
    editingName,
    isDeleteModalOpen,
    deleteCategoryName,
    isSaving,
    startCreate,
    startEdit,
    openDeleteModal,
    commitCreate,
    commitEdit,
    onCreateKeydown,
    onEditKeydown,
    onDeleteConfirm,
} = page
</script>

<template>
    <div
        id="settings-panel-waste-categories"
        role="tabpanel"
        aria-labelledby="settings-tab-waste-categories"
        class="flex flex-col gap-4"
        :class="profile?.isAdmin ? 'min-h-0 flex-1' : ''"
    >
        <template v-if="profile?.isAdmin">
            <ResourceErrorState
                v-if="error"
                class="py-6"
                title="Não foi possível carregar as categorias"
                :hint="error"
                action-label="Tentar novamente"
                @retry="reload"
            />
            <p v-else-if="loading" class="text-sm leading-5 text-neutral-600">A carregar categorias…</p>
            <ScrollableTableSection v-if="!loading && !error" fill-container>
                <SettingsWasteCategoriesInlineTable
                    :categories="categories"
                    :is-creating="isCreating"
                    :new-category-name="newCategoryName"
                    :editing-category-id="editingCategoryId"
                    :editing-name="editingName"
                    :is-saving="isSaving"
                    @update:new-category-name="newCategoryName = $event"
                    @update:editing-name="editingName = $event"
                    @start-create="startCreate"
                    @start-edit="startEdit"
                    @commit-create="commitCreate"
                    @commit-edit="commitEdit"
                    @create-keydown="onCreateKeydown"
                    @edit-keydown="onEditKeydown"
                    @delete="openDeleteModal"
                />
                <template #footer>
                    <ListPaginationBar
                        :page="categoriesPage"
                        :page-size="pageSize"
                        :total="total"
                        @prev="goToPrevPage"
                        @next="goToNextPage"
                    />
                </template>
            </ScrollableTableSection>
        </template>
        <p v-else class="text-sm leading-5 text-neutral-600">
            A gestão de categorias de resíduos está disponível apenas para contas de administrador.
        </p>
    </div>

    <SettingsWasteCategoryDeleteModal
        v-model="isDeleteModalOpen"
        :delete-category-name="deleteCategoryName"
        @confirm="onDeleteConfirm"
    />
</template>
