import { computed, ref } from "vue"
import { campaignsListRef } from "@/modules/campaigns/composables/campaigns-list/campaignsListState"
import type { CampaignListItem } from "@/modules/campaigns/types/list"

export function useCampaignsPageModals() {
    const isCreateModalOpen = ref(false)
    const isEditModalOpen = ref(false)
    const isDeleteModalOpen = ref(false)
    const editCampaignId = ref<string | null>(null)
    const deleteCampaignId = ref<string | null>(null)

    const campaignForEdit = computed<CampaignListItem | null>(() => {
        if (!editCampaignId.value) return null
        return campaignsListRef.value.find((c) => c.id === editCampaignId.value) ?? null
    })

    const deleteCampaignTitle = computed(() => {
        if (!deleteCampaignId.value) return undefined
        return campaignsListRef.value.find((c) => c.id === deleteCampaignId.value)?.title
    })

    function openCreateModal() {
        isCreateModalOpen.value = true
    }

    function openEditModal(id: string) {
        editCampaignId.value = id
        isEditModalOpen.value = true
    }

    function openDeleteModal(id: string) {
        deleteCampaignId.value = id
        isDeleteModalOpen.value = true
    }

    async function confirmDeleteCampaign(removeCampaign: (id: string) => Promise<void>) {
        if (deleteCampaignId.value) await removeCampaign(deleteCampaignId.value)
    }

    return {
        isCreateModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        editCampaignId,
        campaignForEdit,
        deleteCampaignTitle,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        confirmDeleteCampaign,
    }
}
