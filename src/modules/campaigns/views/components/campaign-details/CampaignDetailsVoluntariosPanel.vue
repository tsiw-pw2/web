<script setup lang="ts">
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { registrationRoleTableBadge, registrationStatusTableBadge } from "@/shared/lib/tableValueBadge"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import CampaignDetailsVoluntariosEmptyState from "@/modules/campaigns/views/components/campaign-details/CampaignDetailsVoluntariosEmptyState.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

const { tabs, registration, registrationRows } = useCampaignDetailsPageInject()
const {
    registrations,
    registrationsLoading,
    registrationsPage,
    registrationsTotal,
    tabPageSize,
    goRegistrationsPrev,
    goRegistrationsNext,
} = tabs
const { canManageRegistrations } = registration
</script>

<template>
    <section
        id="campaign-panel-voluntarios"
        role="tabpanel"
        aria-labelledby="campaign-tab-voluntarios"
        class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
    >
        <p v-if="registrationsLoading" class="text-sm leading-5 text-neutral-600">A carregar voluntários…</p>
        <CampaignDetailsVoluntariosEmptyState
            v-else-if="registrationsTotal === 0"
            :can-manage-registrations="canManageRegistrations"
        />
        <ScrollableTableSection v-else fill-container>
            <DataTableScrollWrap class="mt-0">
                <table
                    class="w-full min-w-[920px] table-fixed border-collapse text-left"
                    :class="canManageRegistrations ? 'min-w-[1000px]' : ''"
                >
                    <colgroup>
                        <col :class="canManageRegistrations ? 'w-[18%]' : 'w-[22%]'" />
                        <col :class="canManageRegistrations ? 'w-[24%]' : 'w-[28%]'" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[10%]" />
                        <col v-if="canManageRegistrations" class="min-w-[7.5rem] w-[12%]" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white">
                        <tr class="border-b border-neutral-200">
                            <DataTableTh>Nome</DataTableTh>
                            <DataTableTh>Email</DataTableTh>
                            <DataTableTh align="end">Telefone</DataTableTh>
                            <DataTableTh>Função</DataTableTh>
                            <DataTableTh>Estado</DataTableTh>
                            <DataTableTh>Presença</DataTableTh>
                            <DataTableTh v-if="canManageRegistrations" :padding-end="false" align="end">Acções</DataTableTh>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in registrations"
                            :key="row.id"
                            class="border-b border-neutral-200 last:border-b-0"
                        >
                            <DataTableTd emphasis>{{ row.user?.name ?? "-" }}</DataTableTd>
                            <DataTableTd>{{ row.user?.email ?? "-" }}</DataTableTd>
                            <DataTableTd align="end" class="tabular-nums">{{ row.user?.phone ?? "-" }}</DataTableTd>
                            <DataTableTd :truncate="false">
                                <ApiStateBadge v-bind="registrationRoleTableBadge(row.role)" />
                            </DataTableTd>
                            <DataTableTd :truncate="false">
                                <span class="inline-block max-w-full whitespace-nowrap">
                                    <ApiStateBadge v-bind="registrationStatusTableBadge(row.status)" />
                                </span>
                            </DataTableTd>
                            <DataTableTd>{{ row.attendance === null ? "-" : row.attendance ? "Sim" : "Não" }}</DataTableTd>
                            <DataTableActionsCell
                                v-if="canManageRegistrations"
                                :row-id="row.id"
                                :show-delete="false"
                                edit-label="Gerir inscrição"
                                @edit="registrationRows.onEditRegistrationRow"
                            />
                        </tr>
                    </tbody>
                </table>
            </DataTableScrollWrap>
            <template #footer>
                <ListPaginationBar
                    v-if="registrationsTotal > tabPageSize"
                    :page="registrationsPage"
                    :page-size="tabPageSize"
                    :total="registrationsTotal"
                    @prev="goRegistrationsPrev"
                    @next="goRegistrationsNext"
                />
            </template>
        </ScrollableTableSection>
    </section>
</template>
