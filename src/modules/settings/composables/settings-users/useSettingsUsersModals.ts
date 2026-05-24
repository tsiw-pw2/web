import { computed, ref, type Ref } from "vue"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

export function useSettingsUsersModals(users: Ref<SettingsUserRow[]>) {
    const isBlockModalOpen = ref(false)
    const isUnblockModalOpen = ref(false)
    const actionUserId = ref<string | null>(null)

    const actionUser = computed(() => {
        if (!actionUserId.value) return null
        return users.value.find((u) => u.id === actionUserId.value) ?? null
    })

    const actionUserDisplayName = computed(() => actionUser.value?.name)

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
        actionUser,
        actionUserDisplayName,
        openBlockModal,
        openUnblockModal,
        clearActionUser,
    }
}
