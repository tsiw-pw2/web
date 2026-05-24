<script setup lang="ts">
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"
import { useBeachesPageState } from "@/modules/beaches/composables/beaches-list/useBeachesPageState"
import { useBeachesViewMode } from "@/modules/beaches/composables/beaches-list/useBeachesViewMode"
import BeachesPageContent from "@/modules/beaches/views/components/beaches-list/BeachesPageContent.vue"
import BeachesPageHeader from "@/modules/beaches/views/components/beaches-list/BeachesPageHeader.vue"
import BeachesPageModals from "@/modules/beaches/views/components/beaches-list/BeachesPageModals.vue"
import type { BeachUpsertDraft } from "@/modules/beaches/types/list"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"

const page = useBeachesPageState()
const beachesView = useBeachesViewMode()
const { viewMode, mapBeaches, mapLoading, mapError, setViewMode, reloadMap } = beachesView
const { canManage } = useCanManageCatalog()

const {
    loading,
    error,
    errorHint,
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
        <div class="flex shrink-0 flex-col gap-4">
            <BeachesPageHeader @create="openCreateModal" />
            <AnimatedTabBar ariaLabel="Vista de praias" class="min-w-0 px-px">
                <AnimatedTabTrigger
                    id="beaches-tab-list"
                    role="tab"
                    type="button"
                    :active="viewMode === 'list'"
                    @click="setViewMode('list')"
                >
                    Lista
                </AnimatedTabTrigger>
                <AnimatedTabTrigger
                    id="beaches-tab-map"
                    role="tab"
                    type="button"
                    :active="viewMode === 'map'"
                    @click="setViewMode('map')"
                >
                    Mapa
                </AnimatedTabTrigger>
            </AnimatedTabBar>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
        <BeachesPageContent
            :view-mode="viewMode"
            :loading="loading"
            :error="error"
            :error-hint="errorHint"
            :beaches="beaches"
            :map-beaches="mapBeaches"
            :map-loading="mapLoading"
            :map-error="mapError"
            :page="currentPage"
            :page-size="pageSize"
            :total="total"
            @retry="viewMode === 'map' ? reloadMap() : reload()"
            @create="openCreateModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @prev="goToPrevPage"
            @next="goToNextPage"
        />
        </div>
    </div>
    <BeachesPageModals
        v-if="canManage"
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
