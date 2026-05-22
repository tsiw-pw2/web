import { computed, ref, type Ref } from "vue"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

export function useSettingsUsersModals(users: Ref<SettingsUserRow[]>) {
    const isBlockModalOpen = ref(false)
    const isUnblockModalOpen = ref(false)
    const actionUserId = ref<string | null>(null)

    const actionUserDisplayName = computed(() => {
        if (!actionUserId.value) return undefined
        return users.value.find((u) => u.id === actionUserId.value)?.name
    })

    function openBlockModal(userId: string) {
        actionUserId.value = userId
        isBlockModalOpen.value = true
    }

    function openUnblockModal(userId: string) {
        actionUserId.value = userId
        isUnblockModalOpen.value = true
    }

    function clearActionUser() {
        actionUserId.value = null
    }

    return {
        isBlockModalOpen,
        isUnblockModalOpen,
        actionUserId,
        actionUserDisplayName,
        openBlockModal,
        openUnblockModal,
        clearActionUser,
    }
}
