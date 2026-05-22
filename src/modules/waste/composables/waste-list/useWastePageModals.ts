import { computed, ref } from "vue"
import { wasteItemsListRef } from "@/modules/waste/composables/waste-list/wasteListState"

export function useWastePageModals() {
    const isCreateModalOpen = ref(false)
    const isEditModalOpen = ref(false)
    const isDeleteModalOpen = ref(false)
    const editWasteId = ref<string | null>(null)
    const deleteWasteId = ref<string | null>(null)

    const wasteForEdit = computed(() => {
        if (!editWasteId.value) return null
        return wasteItemsListRef.value.find((w) => w.id === editWasteId.value) ?? null
    })

    const deleteWasteName = computed(() => {
        if (!deleteWasteId.value) return undefined
        return wasteItemsListRef.value.find((w) => w.id === deleteWasteId.value)?.name
    })

    function openCreateModal() {
        isCreateModalOpen.value = true
    }

    function openEditModal(id: string) {
        editWasteId.value = id
        isEditModalOpen.value = true
    }

    function openDeleteModal(id: string) {
        deleteWasteId.value = id
        isDeleteModalOpen.value = true
    }

    async function confirmDeleteWaste(removeWaste: (id: string) => Promise<void>) {
        if (deleteWasteId.value) await removeWaste(deleteWasteId.value)
    }

    return {
        isCreateModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        editWasteId,
        wasteForEdit,
        deleteWasteName,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        confirmDeleteWaste,
    }
}
