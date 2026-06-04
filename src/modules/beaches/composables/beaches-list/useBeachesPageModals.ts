import { computed, ref } from "vue"
import { beachesListRef } from "@/modules/beaches/composables/beaches-list/beachesListState"
import type { BeachListItem } from "@/modules/beaches/types/list"

// Composable que gere a lógica de beaches página modals.
export function useBeachesPageModals() {
    const isCreateModalOpen = ref(false)
    const isEditModalOpen = ref(false)
    const isDeleteModalOpen = ref(false)
    const editBeachId = ref<string | null>(null)
    const deleteBeachId = ref<string | null>(null)

    const beachForEdit = computed<BeachListItem | null>(() => {
        if (!editBeachId.value) return null
        return beachesListRef.value.find((b) => b.id === editBeachId.value) ?? null
    })

    const deleteBeachName = computed(() => {
        if (!deleteBeachId.value) return undefined
        return beachesListRef.value.find((b) => b.id === deleteBeachId.value)?.name
    })

// Abre criação modal.
    function openCreateModal() {
        isCreateModalOpen.value = true
    }

// Abre edição modal.
    function openEditModal(id: string) {
        editBeachId.value = id
        isEditModalOpen.value = true
    }

// Abre eliminação modal.
    function openDeleteModal(id: string) {
        deleteBeachId.value = id
        isDeleteModalOpen.value = true
    }

// Confirma e executa a eliminação da praia seleccionada no modal.
    async function confirmDeleteBeach(removeBeach: (id: string) => Promise<void>) {
        if (deleteBeachId.value) await removeBeach(deleteBeachId.value)
    }

    return {
        isCreateModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        editBeachId,
        beachForEdit,
        deleteBeachName,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        confirmDeleteBeach,
    }
}
