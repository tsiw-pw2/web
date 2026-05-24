<script setup lang="ts">
import BlockUserModal from "@/modules/settings/views/components/BlockUserModal.vue"
import UnblockUserModal from "@/modules/settings/views/components/UnblockUserModal.vue"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"

defineProps<{
    isBlockModalOpen: boolean
    isUnblockModalOpen: boolean
    actionUser: SettingsUserRow | null
    actionUserDisplayName: string | undefined
}>()

const emit = defineEmits<{
    "update:isBlockModalOpen": [value: boolean]
    "update:isUnblockModalOpen": [value: boolean]
    blockConfirm: [reason: string]
    unblockConfirm: []
}>()
</script>

<template>
    <BlockUserModal
        :model-value="isBlockModalOpen"
        :user-display-name="actionUserDisplayName"
        @update:model-value="emit('update:isBlockModalOpen', $event)"
        @confirm="emit('blockConfirm', $event)"
    />
    <UnblockUserModal
        :model-value="isUnblockModalOpen"
        :user-display-name="actionUserDisplayName"
        @update:model-value="emit('update:isUnblockModalOpen', $event)"
        @confirm="emit('unblockConfirm')"
    />
</template>
