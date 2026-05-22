<script setup lang="ts">
import { useSettingsUsersPageState } from "@/modules/settings/composables/settings-users/useSettingsUsersPageState"
import SettingsUsersPageContent from "@/modules/settings/views/components/settings-users/SettingsUsersPageContent.vue"
import SettingsUsersPageHeader from "@/modules/settings/views/components/settings-users/SettingsUsersPageHeader.vue"
import SettingsUsersPageModals from "@/modules/settings/views/components/settings-users/SettingsUsersPageModals.vue"

const page = useSettingsUsersPageState()

const {
    profile,
    users,
    page: usersPage,
    pageSize: usersPageSize,
    total: usersTotal,
    loading: usersLoading,
    error: usersError,
    goToPrevPage,
    goToNextPage,
    isBlockModalOpen,
    isUnblockModalOpen,
    actionUserDisplayName,
    openBlockModal,
    openUnblockModal,
    onBlockConfirm,
    onUnblockConfirm,
} = page
</script>

<template>
    <div
        id="settings-panel-users"
        role="tabpanel"
        aria-labelledby="settings-tab-users"
        class="flex flex-col gap-4"
        :class="profile?.isAdmin ? 'min-h-0 flex-1' : ''"
    >
        <template v-if="profile?.isAdmin">
            <SettingsUsersPageHeader :users-error="usersError" :users-loading="usersLoading" />

            <SettingsUsersPageContent
                v-if="!usersLoading && !usersError"
                :users="users"
                :users-page="usersPage"
                :users-page-size="usersPageSize"
                :users-total="usersTotal"
                @block="openBlockModal"
                @unblock="openUnblockModal"
                @prev="goToPrevPage"
                @next="goToNextPage"
            />
        </template>
        <p v-else class="text-sm leading-5 text-neutral-600">
            A gestão da lista de utilizadores está disponível apenas para contas de administrador.
        </p>
    </div>

    <SettingsUsersPageModals
        v-model:is-block-modal-open="isBlockModalOpen"
        v-model:is-unblock-modal-open="isUnblockModalOpen"
        :action-user-display-name="actionUserDisplayName"
        @block-confirm="onBlockConfirm"
        @unblock-confirm="onUnblockConfirm"
    />
</template>
