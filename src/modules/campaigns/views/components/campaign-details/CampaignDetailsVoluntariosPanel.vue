<script setup lang="ts">
import { computed } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { registrationRoleLabel, registrationStatusLabel } from "@/modules/campaigns/lib/registrationLabels"
import DataTableActionsCell from "@/shared/components/data-table/DataTableActionsCell.vue"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"

const { core, tabs, registration, registrationRows } = useCampaignDetailsPageInject()
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
const campaign = computed(() => core.campaign.value!)
</script>

<template>
    <section
        id="campaign-panel-voluntarios"
        role="tabpanel"
        aria-labelledby="campaign-tab-voluntarios"
        class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
    >
        <p v-if="registrationsLoading" class="text-sm leading-5 text-neutral-600">A carregar voluntários…</p>
        <p v-else-if="campaign.metrics.registrationsCount === 0" class="text-sm leading-5 text-neutral-600">
            Ainda não há voluntários inscritos.
        </p>
        <ScrollableTableSection v-else fill-container>
            <DataTableScrollWrap class="mt-0">
                <table
                    class="w-full table-fixed border-collapse text-left"
                    :class="canManageRegistrations ? 'min-w-[1000px]' : 'min-w-[920px]'"
                >
                    <colgroup>
                        <col :class="canManageRegistrations ? 'w-[18%]' : 'w-[20%]'" />
                        <col :class="canManageRegistrations ? 'w-[22%]' : 'w-[26%]'" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col v-if="canManageRegistrations" class="w-[12%]" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white">
                        <tr class="border-b border-neutral-200">
                            <DataTableTh>Nome</DataTableTh>
                            <DataTableTh>Email</DataTableTh>
                            <DataTableTh align="end">Telefone</DataTableTh>
                            <DataTableTh>Função</DataTableTh>
                            <DataTableTh>Estado</DataTableTh>
                            <DataTableTh>Presença</DataTableTh>
                            <DataTableTh v-if="canManageRegistrations" align="end">Acções</DataTableTh>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in registrations"
                            :key="row.id"
                            class="border-b border-neutral-200 last:border-b-0"
                        >
                            <DataTableTd emphasis>{{ row.user?.name ?? "—" }}</DataTableTd>
                            <DataTableTd>{{ row.user?.email ?? "—" }}</DataTableTd>
                            <DataTableTd align="end" class="tabular-nums">{{ row.user?.phone ?? "—" }}</DataTableTd>
                            <DataTableTd>{{ registrationRoleLabel(row.role) }}</DataTableTd>
                            <DataTableTd>{{ registrationStatusLabel(row.status) }}</DataTableTd>
                            <DataTableTd>{{ row.attendance === null ? "—" : row.attendance ? "Sim" : "Não" }}</DataTableTd>
                            <DataTableActionsCell
                                v-if="canManageRegistrations"
                                :row-id="row.id"
                                edit-label="Gerir inscrição"
                                delete-label="Remover inscrição"
                                @edit="registrationRows.onEditRegistrationRow"
                                @delete="registrationRows.onDeleteRegistrationRow"
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
