<script setup lang="ts">
import { useRouter } from "vue-router"
import { useSettingsUsersPageState } from "@/modules/settings/composables/settings-users/useSettingsUsersPageState"
import SettingsUsersPageContent from "@/modules/settings/views/components/settings-users/SettingsUsersPageContent.vue"
import SettingsUsersPageHeader from "@/modules/settings/views/components/settings-users/SettingsUsersPageHeader.vue"
import SettingsUsersFilteredEmptyState from "@/modules/settings/views/states/SettingsUsersFilteredEmptyState.vue"

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
    invalidRoleFilter,
    hasInvalidRoleFilter,
    goToPrevPage,
    goToNextPage,
    reload,
    clearInvalidRoleFilter,
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
        class="flex flex-col gap-6"
        :class="profile?.isAdmin ? 'min-h-0 flex-1' : ''"
    >
        <template v-if="profile?.isAdmin">
            <div class="flex flex-col gap-1">
                <h3 class="text-base font-semibold leading-6 text-neutral-950">Lista de utilizadores</h3>
                <p class="text-sm leading-5 text-neutral-600">
                    Consulta contas registadas e abre o detalhe para rever informação e permissões.
                </p>
            </div>

            <SettingsUsersPageHeader
                v-if="!hasInvalidRoleFilter"
                :users-error="usersError"
                :users-loading="usersLoading"
                @retry="reload"
            />

            <SettingsUsersFilteredEmptyState
                v-if="hasInvalidRoleFilter && invalidRoleFilter"
                class="flex min-h-0 flex-1 flex-col"
                :role="invalidRoleFilter"
                @clear-filter="clearInvalidRoleFilter"
            />
            <SettingsUsersPageContent
                v-else-if="!usersLoading && !usersError"
                class="flex min-h-0 flex-1 flex-col"
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
