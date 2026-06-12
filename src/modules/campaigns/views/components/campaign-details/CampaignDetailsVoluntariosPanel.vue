<script setup lang="ts">
import { computed, ref } from "vue"
import { useCampaignDetailsPageInject } from "@/modules/campaigns/composables/campaign-details/useCampaignDetailsPageInject"
import { registrationRoleTableBadge, registrationStatusTableBadge } from "@/shared/lib/tableValueBadge"
import { patchRegistration } from "@/modules/campaigns/services/campaignRegistrations"
import { toastError, toastSuccess } from "@/infrastructure/appToast"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import Button from "@/shared/components/ui/Button.vue"
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
    reloadRegistrationsFirstPage,
} = tabs
const { canManageRegistrations, canEditVolunteerRegistrations } = registration

const statusFilter = ref<"all" | "0" | "1" | "2">("all")
const attendanceFilter = ref<"all" | "present" | "absent" | "unset">("all")
const bulkWorking = ref(false)

const filteredRegistrations = computed(() => {
    return registrations.value.filter((row) => {
        if (statusFilter.value !== "all" && row.status !== Number(statusFilter.value)) return false
        if (attendanceFilter.value === "present" && row.attendance !== true) return false
        if (attendanceFilter.value === "absent" && row.attendance !== false) return false
        if (attendanceFilter.value === "unset" && row.attendance !== null) return false
        return true
    })
})

const pendingCount = computed(() => registrations.value.filter((r) => r.status === 0).length)
const confirmablePresentCount = computed(
    () => registrations.value.filter((r) => r.status === 1 && r.attendance !== true).length,
)

async function confirmAllPending() {
    const pending = registrations.value.filter((r) => r.status === 0)
    if (pending.length === 0) return
    bulkWorking.value = true
    try {
        await Promise.all(pending.map((row) => patchRegistration(row, { status: 1 })))
        toastSuccess(`${pending.length} inscrição(ões) confirmada(s).`)
        await reloadRegistrationsFirstPage({ silent: true })
    } catch {
        toastError("Não foi possível confirmar as inscrições pendentes.")
    } finally {
        bulkWorking.value = false
    }
}

async function markAllPresent() {
    const rows = registrations.value.filter((r) => r.status === 1 && r.attendance !== true)
    if (rows.length === 0) return
    bulkWorking.value = true
    try {
        await Promise.all(rows.map((row) => patchRegistration(row, { attendance: true })))
        toastSuccess(`Presença marcada para ${rows.length} voluntário(s).`)
        await reloadRegistrationsFirstPage({ silent: true })
    } catch {
        toastError("Não foi possível marcar presenças.")
    } finally {
        bulkWorking.value = false
    }
}
</script>

<template>
    <section
        id="campaign-panel-voluntarios"
        role="tabpanel"
        aria-labelledby="campaign-tab-voluntarios"
        class="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
    >
        <p
            v-if="canManageRegistrations && !canEditVolunteerRegistrations && registrationsTotal > 0"
            class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
        >
            Campanha concluída ou cancelada — as inscrições são apenas de consulta.
        </p>

        <div
            v-if="canEditVolunteerRegistrations && registrationsTotal > 0"
            class="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
        >
            <p class="text-sm text-neutral-700">
                <span class="font-medium">Pendente</span> — aguarda confirmação da organização.
                <span class="font-medium">Confirmada</span> — inscrição aceite.
                <span class="font-medium">Cancelada</span> — inscrição anulada.
            </p>
            <div class="flex flex-wrap items-end gap-3">
                <label class="flex flex-col gap-1 text-sm">
                    <span class="font-medium text-neutral-700">Estado</span>
                    <select v-model="statusFilter" class="rounded-md border border-neutral-300 bg-white px-2 py-1.5">
                        <option value="all">Todos</option>
                        <option value="0">Pendentes</option>
                        <option value="1">Confirmadas</option>
                        <option value="2">Canceladas</option>
                    </select>
                </label>
                <label class="flex flex-col gap-1 text-sm">
                    <span class="font-medium text-neutral-700">Presença</span>
                    <select v-model="attendanceFilter" class="rounded-md border border-neutral-300 bg-white px-2 py-1.5">
                        <option value="all">Todas</option>
                        <option value="present">Presentes</option>
                        <option value="absent">Ausentes</option>
                        <option value="unset">Por marcar</option>
                    </select>
                </label>
                <Button
                    variant="secondary"
                    :disabled="bulkWorking || pendingCount === 0"
                    @click="confirmAllPending"
                >
                    Confirmar pendentes ({{ pendingCount }})
                </Button>
                <Button
                    variant="secondary"
                    :disabled="bulkWorking || confirmablePresentCount === 0"
                    @click="markAllPresent"
                >
                    Marcar presença em lote
                </Button>
            </div>
        </div>

        <p v-if="registrationsLoading" class="text-sm leading-5 text-neutral-600">A carregar voluntários…</p>
        <CampaignDetailsVoluntariosEmptyState
            v-else-if="registrationsTotal === 0"
            :can-manage-registrations="canManageRegistrations"
        />
        <ScrollableTableSection v-else fill-container>
            <DataTableScrollWrap class="mt-0">
                <table
                    class="w-full min-w-[920px] table-fixed border-collapse text-left"
                    :class="canEditVolunteerRegistrations ? 'min-w-[1000px]' : ''"
                >
                    <colgroup>
                        <col :class="canEditVolunteerRegistrations ? 'w-[18%]' : 'w-[22%]'" />
                        <col :class="canEditVolunteerRegistrations ? 'w-[24%]' : 'w-[28%]'" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[12%]" />
                        <col class="w-[10%]" />
                        <col v-if="canEditVolunteerRegistrations" class="min-w-[7.5rem] w-[12%]" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white">
                        <tr class="border-b border-neutral-200">
                            <DataTableTh>Nome</DataTableTh>
                            <DataTableTh>Email</DataTableTh>
                            <DataTableTh align="end">Telefone</DataTableTh>
                            <DataTableTh>Função</DataTableTh>
                            <DataTableTh title="Pendente: aguarda confirmação · Confirmada: aceite · Cancelada: anulada">
                                Estado
                            </DataTableTh>
                            <DataTableTh title="Marca presença no dia da campanha">Presença</DataTableTh>
                            <DataTableTh v-if="canEditVolunteerRegistrations" :padding-end="false" align="end">Acções</DataTableTh>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in filteredRegistrations"
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
                                v-if="canEditVolunteerRegistrations"
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
