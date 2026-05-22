<script setup lang="ts">
import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import { userAccountStateBadge } from "@/shared/lib/apiStatePresentation"

defineProps<{
    users: SettingsUserRow[]
    usersPage: number
    usersPageSize: number
    usersTotal: number
}>()

const emit = defineEmits<{
    block: [userId: string]
    unblock: [userId: string]
    prev: []
    next: []
}>()
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-4">
        <ScrollableTableSection fill-container>
            <DataTableScrollWrap>
                <table class="w-full min-w-[920px] table-fixed border-collapse text-left">
                    <colgroup>
                        <col class="w-[22%]" />
                        <col class="w-[30%]" />
                        <col class="w-[16%]" />
                        <col class="w-[14%]" />
                        <col class="min-w-40 w-[18%]" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white">
                        <tr class="border-b border-neutral-200">
                            <DataTableTh>Nome</DataTableTh>
                            <DataTableTh>E-mail</DataTableTh>
                            <DataTableTh>Perfil</DataTableTh>
                            <DataTableTh>Estado</DataTableTh>
                            <DataTableTh :padding-end="false" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id" class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                            <DataTableTd emphasis>{{ u.name }}</DataTableTd>
                            <DataTableTd>{{ u.email }}</DataTableTd>
                            <DataTableTd>{{ userRoleLabel(u) }}</DataTableTd>
                            <DataTableTd :truncate="false">
                                <ApiStateBadge v-bind="userAccountStateBadge(u.isBlocked)" />
                            </DataTableTd>
                            <DataTableTd :padding-end="false" :truncate="false">
                                <div class="flex h-10 max-h-10 items-center justify-end gap-1 overflow-hidden pe-2">
                                    <button
                                        v-if="!u.isBlocked"
                                        type="button"
                                        class="rounded-md px-2 py-0.5 text-xs font-semibold leading-tight text-red-600 outline-none hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-neutral-200"
                                        @click="emit('block', u.id)"
                                    >
                                        Bloquear
                                    </button>
                                    <button
                                        v-else
                                        type="button"
                                        class="rounded-md px-2 py-0.5 text-xs font-semibold leading-tight text-neutral-700 outline-none hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-neutral-200"
                                        @click="emit('unblock', u.id)"
                                    >
                                        Desbloquear
                                    </button>
                                </div>
                            </DataTableTd>
                        </tr>
                    </tbody>
                </table>
            </DataTableScrollWrap>
            <template #footer>
                <ListPaginationBar
                    v-if="usersTotal > 0"
                    :page="usersPage"
                    :page-size="usersPageSize"
                    :total="usersTotal"
                    @prev="emit('prev')"
                    @next="emit('next')"
                />
            </template>
        </ScrollableTableSection>
    </div>
</template>
