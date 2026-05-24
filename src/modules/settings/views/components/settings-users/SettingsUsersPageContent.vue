<script setup lang="ts">
import { userAccountStateTableBadge, userRoleTableBadge } from "@/shared/lib/tableValueBadge"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"

defineProps<{
    users: SettingsUserRow[]
    usersPage: number
    usersPageSize: number
    usersTotal: number
}>()

const emit = defineEmits<{
    open: [userId: string]
    prev: []
    next: []
}>()

function onRowClick(userId: string) {
    emit("open", userId)
}
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-4">
        <ScrollableTableSection fill-container>
            <DataTableScrollWrap>
                <table class="w-full min-w-[880px] table-fixed border-collapse text-left">
                    <colgroup>
                        <col class="w-[22%]" />
                        <col class="w-[32%]" />
                        <col class="w-[16%]" />
                        <col class="w-[15%]" />
                        <col class="w-[15%]" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white">
                        <tr class="border-b border-neutral-200">
                            <DataTableTh>Nome</DataTableTh>
                            <DataTableTh>E-mail</DataTableTh>
                            <DataTableTh>Telefone</DataTableTh>
                            <DataTableTh>Cargo</DataTableTh>
                            <DataTableTh :padding-end="false">Estado</DataTableTh>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="u in users"
                            :key="u.id"
                            class="cursor-pointer border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                            @click="onRowClick(u.id)"
                        >
                            <DataTableTd emphasis>{{ u.name }}</DataTableTd>
                            <DataTableTd>{{ u.email }}</DataTableTd>
                            <DataTableTd>{{ u.phone?.trim() || "—" }}</DataTableTd>
                            <DataTableTd :truncate="false">
                                <ApiStateBadge v-bind="userRoleTableBadge(u)" />
                            </DataTableTd>
                            <DataTableTd :padding-end="false" :truncate="false">
                                <ApiStateBadge v-bind="userAccountStateTableBadge(u.isBlocked)" />
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
