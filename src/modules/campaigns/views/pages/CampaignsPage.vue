<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { getAccessToken } from "@/infrastructure/access-token"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"
import { useCampaignsPageState } from "@/modules/campaigns/composables/campaigns-list/useCampaignsPageState"
import { usePublicCampaignsPageState } from "@/modules/campaigns/composables/campaigns-list/usePublicCampaignsPageState"
import type { CampaignCreateDraft } from "@/modules/campaigns/types/list"
import CampaignsPageContent from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageContent.vue"
import CampaignsListFiltersBar from "@/modules/campaigns/views/components/campaigns-list/CampaignsListFiltersBar.vue"
import CampaignsPageHeader from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageHeader.vue"
import CampaignsPageModals from "@/modules/campaigns/views/components/campaigns-list/CampaignsPageModals.vue"
import PublicCampaignsList from "@/modules/campaigns/views/components/campaigns-list/PublicCampaignsList.vue"
import Button from "@/shared/components/ui/Button.vue"
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"

const isAuthenticated = computed(() => Boolean(getAccessToken()))
const router = useRouter()
const publicPage = usePublicCampaignsPageState()
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
} = page

const {
    search: campaignsSearch,
    statuses: campaignsStatuses,
    hasActiveFilters,
    clearAllFilters,
} = listFilters

function openCampaign(id: string) {
    void router.push({ name: "campaign-details", params: { campaignId: id, tab: "informacoes" } })
}
</script>

<template>
    <div v-if="!isAuthenticated" class="flex min-h-0 flex-1 flex-col gap-6">
        <div class="shrink-0">
            <h2 class="text-xl font-semibold text-neutral-950">Campanhas activas</h2>
            <p class="mt-1 text-sm text-neutral-600">
                Explora campanhas de limpeza costeira. Inicia sessão para te inscreveres ou gerires acções.
            </p>
            <RouterLink :to="routePaths.login" class="mt-4 inline-flex">
                <Button>Entrar</Button>
            </RouterLink>
        </div>
        <div v-if="publicPage.loading.value" class="text-sm text-neutral-600">A carregar…</div>
        <p v-else-if="publicPage.error.value" class="text-sm text-red-700">
            Não foi possível carregar as campanhas.
            <button type="button" class="ml-2 underline" @click="publicPage.reload()">Tentar novamente</button>
        </p>
        <PublicCampaignsList v-else :campaigns="publicPage.campaigns.value" />
    </div>

    <div v-else class="flex min-h-0 flex-1 flex-col gap-6">
        <CampaignsPageHeader class="shrink-0" @create="openCreateModal" />
        <CampaignsListFiltersBar
            v-model:search="campaignsSearch"
            v-model:statuses="campaignsStatuses"
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
        v-if="isAuthenticated && canManage"
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
