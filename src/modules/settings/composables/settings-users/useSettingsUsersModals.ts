import { computed, ref, type Ref } from "vue"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

// Composable que gere a lógica de definições utilizadores modals.
export function useSettingsUsersModals(users: Ref<SettingsUserRow[]>) {
    const isBlockModalOpen = ref(false)
    const isUnblockModalOpen = ref(false)
    const actionUserId = ref<string | null>(null)

    const actionUser = computed(() => {
        if (!actionUserId.value) return null
        return users.value.find((u) => u.id === actionUserId.value) ?? null
    })

    const actionUserDisplayName = computed(() => actionUser.value?.name)

// Abre block modal.
    function openBlockModal(userId: string) {
        actionUserId.value = userId
        isBlockModalOpen.value = true
    }

// Abre unblock modal.
    function openUnblockModal(userId: string) {
        actionUserId.value = userId
        isUnblockModalOpen.value = true
    }

// Limpa o utilizador selecionado nas modais de bloqueio.
    function clearActionUser() {
        actionUserId.value = null
    }

    return {
        isBlockModalOpen,
        isUnblockModalOpen,
        actionUserId,
        actionUser,
        actionUserDisplayName,
        openBlockModal,
        openUnblockModal,
        clearActionUser,
    }
}
