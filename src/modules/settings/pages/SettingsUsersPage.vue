<script setup lang="ts">
import { useRouter } from "vue-router"
import { useSettingsUsersPageState } from "@/modules/settings/composables/settings-users/useSettingsUsersPageState"
import SettingsUsersPageContent from "@/modules/settings/views/components/settings-users/SettingsUsersPageContent.vue"
import SettingsUsersPageHeader from "@/modules/settings/views/components/settings-users/SettingsUsersPageHeader.vue"
const router = useRouter()
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
    reload,
} = page

function openUserDetails(userId: string) {
    void router.push({
        name: "settings-user-details",
        params: { userId, tab: "informacao" },
    })
}
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
            <SettingsUsersPageHeader
                :users-error="usersError"
                :users-loading="usersLoading"
                @retry="reload"
            />

            <SettingsUsersPageContent
                v-if="!usersLoading && !usersError"
                :users="users"
                :users-page="usersPage"
                :users-page-size="usersPageSize"
                :users-total="usersTotal"
                @open="openUserDetails"
                @prev="goToPrevPage"
                @next="goToNextPage"
            />
        </template>
        <p v-else class="text-sm leading-5 text-neutral-600">
            A gestão da lista de utilizadores está disponível apenas para contas de administrador.
        </p>
    </div>
</template>
