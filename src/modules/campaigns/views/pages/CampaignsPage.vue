<script setup lang="ts">
import { useRouter } from "vue-router"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"
import { useCampaignsPageState } from "@/modules/campaigns/composables/campaigns-list/useCampaignsPageState"
import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"
import CampaignsPageContent from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageContent.vue"
import CampaignsListFiltersBar from "@/modules/campaigns/views/components/campaigns-list/CampaignsListFiltersBar.vue"
import CampaignsPageHeader from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageHeader.vue"
import CampaignsPageModals from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageModals.vue"

const router = useRouter()
const page = useCampaignsPageState()
const { canManage } = useCanManageCatalog()

const {
    loading,
    error,
    errorHint,
    campaigns,
    page: currentPage,
    pageSize,
    total,
    reload,
    goToPrevPage,
    goToNextPage,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    campaignForEdit,
    deleteCampaignTitle,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    createCampaignWithToast,
    saveCampaignWithToast,
    confirmDeleteCampaign,
    removeCampaign,
    listFilters,
    districtOptions,
} = page

const {
    search: campaignsSearch,
    statuses: campaignsStatuses,
    district: campaignsDistrict,
    hasActiveFilters,
    clearAllFilters,
} = listFilters

function openCampaign(id: string) {
    void router.push({ name: "campaign-details", params: { campaignId: id, tab: "informacoes" } })
}
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <CampaignsPageHeader class="shrink-0" @create="openCreateModal" />
        <CampaignsListFiltersBar
            v-model:search="campaignsSearch"
            v-model:statuses="campaignsStatuses"
            v-model:district="campaignsDistrict"
            :district-options="districtOptions"
            class="shrink-0"
        />
        <div class="flex min-h-0 flex-1 flex-col">
            <CampaignsPageContent
                :loading="loading"
                :error="error"
                :error-hint="errorHint"
                :campaigns="campaigns"
                :page="currentPage"
                :page-size="pageSize"
                :total="total"
                :has-active-filters="hasActiveFilters"
                @retry="reload"
                @create="openCreateModal"
                @clear-filters="clearAllFilters"
                @select="openCampaign"
                @edit="openEditModal"
                @delete="openDeleteModal"
                @prev="goToPrevPage"
                @next="goToNextPage"
            />
        </div>
    </div>
    <CampaignsPageModals
        v-if="canManage"
        v-model:is-create-modal-open="isCreateModalOpen"
        v-model:is-edit-modal-open="isEditModalOpen"
        v-model:is-delete-modal-open="isDeleteModalOpen"
        :campaign-for-edit="campaignForEdit"
        :delete-campaign-title="deleteCampaignTitle"
        @create="createCampaignWithToast"
        @save="(payload: CampaignCreateDraft) => campaignForEdit && saveCampaignWithToast(campaignForEdit.id, payload)"
        @confirm-delete="() => confirmDeleteCampaign(removeCampaign)"
    />
</template>
