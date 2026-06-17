<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { useSettingsUserDetails } from "@/modules/settings/composables/settings-user-details/useSettingsUserDetails"
import { formatSettingsDateOnly, formatSettingsDateTime } from "@/modules/settings/lib/formatSettingsDate"
import { SETTINGS_USER_DETAILS_TABS, settingsUserDetailsTabFromRoute, type SettingsUserDetailsTabId, } from "@/modules/settings/lib/settingsUserDetailsTabs"
import { SETTINGS_USER_ROLE_OPTIONS } from "@/modules/settings/lib/settingsUserRole"
import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
import { blockUser, unblockUser } from "@/modules/settings/services/settingsUsers"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import BlockUserModal from "@/modules/settings/views/components/BlockUserModal.vue"
import UnblockUserModal from "@/modules/settings/views/components/UnblockUserModal.vue"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import DataTableScrollWrap from "@/shared/components/data-table/DataTableScrollWrap.vue"
import DataTableTd from "@/shared/components/data-table/DataTableTd.vue"
import DataTableTh from "@/shared/components/data-table/DataTableTh.vue"
import ListPaginationBar from "@/shared/components/ListPaginationBar.vue"
import ScrollableTableSection from "@/shared/components/ScrollableTableSection.vue"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { userAccountStateBadge } from "@/shared/lib/apiStatePresentation"
import { campaignDetailUiStatusTableBadge, registrationRoleTableBadge, registrationStatusTableBadge, } from "@/shared/lib/tableValueBadge"
import { resolveAvatarDisplaySrc } from "@/shared/lib/avatarUrl"
import { initialsFromDisplayName } from "@/shared/lib/userInitials"
import { useDocumentTitle } from "@/shared/composables/useDocumentTitle"

const route = useRoute()
const router = useRouter()
const profile = inject(settingsProfileKey)

const userId = computed(() => String(route.params.userId ?? ""))
const activeTab = computed(() => settingsUserDetailsTabFromRoute(route.params.tab))

const {
    user,
    loading,
    error,
    selectedRole,
    savingRole,
    canSaveRole,
    saveRole,
    registrations,
    registrationsPage,
    registrationsTotal,
    registrationsLoading,
    goRegistrationsPrev,
    goRegistrationsNext,
    organizedCampaigns,
    organizedPage,
    organizedTotal,
    organizedLoading,
    goOrganizedPrev,
    goOrganizedNext,
    tabPageSize,
    loadUser,
} = useSettingsUserDetails(userId, activeTab)

const browserTitle = computed(() => {
    const name = user.value?.name?.trim() || "Utilizador"
    const tab = SETTINGS_USER_DETAILS_TABS.find((t) => t.id === activeTab.value)?.label
    return tab ? `${name} - ${tab}` : name
})

useDocumentTitle(browserTitle)

const isBlockModalOpen = ref(false)
const isUnblockModalOpen = ref(false)
const blockActionBusy = ref(false)

const roleOptions = SETTINGS_USER_ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

const isSelf = computed(() => {
    const me = profile?.value
    const u = user.value
    if (!me || !u) return false
    return me.id === u.id
})

const avatarSrc = computed(() => resolveAvatarDisplaySrc(user.value?.avatarUrl))
const avatarInitials = computed(() => initialsFromDisplayName(user.value?.name ?? ""))

const detailRows = computed(() => {
    const u = user.value
    if (!u) return []
    return [
        { label: "E-mail", value: u.email },
        { label: "Telefone", value: u.phone?.trim() || "-" },
        { label: "Data de nascimento", value: formatSettingsDateOnly(u.birthDate) },
        { label: "Registo na plataforma", value: formatSettingsDateTime(u.createdAt) },
        ...(u.isBlocked && u.blockedReason ? [{ label: "Motivo do bloqueio", value: u.blockedReason }] : []),
        ...(u.isBlocked && u.blockedAt ? [{ label: "Bloqueada em", value: formatSettingsDateTime(u.blockedAt) }] : []),
    ]
})

const metricCards = computed(() => {
    const m = user.value?.metrics
    if (!m) return []
    return [
        { label: "Participações", value: m.registrationsCount },
        { label: "Campanhas organizadas", value: m.organizedCampaignsCount },
        { label: "Recolhas registadas", value: m.wasteCollectionsCount },
        { label: "Praias criadas", value: m.beachesCreatedCount },
    ]
})

function tabRoute(tab: SettingsUserDetailsTabId) {
    return { name: "settings-user-details" as const, params: { userId: userId.value, tab } }
}

function goBack() {
    router.push({ name: "settings-users" })
}

async function onBlockConfirm(reason: string) {
    const u = user.value
    if (!u || blockActionBusy.value) return
    blockActionBusy.value = true
    try {
        await blockUser(u.id, reason)
        await loadUser()
        isBlockModalOpen.value = false
        toastSuccess("Conta bloqueada", "O utilizador deixou de poder iniciar sessão.")
    } catch (e) {
        toastFromListMutationError(e, { mode: "save" })
    } finally {
        blockActionBusy.value = false
    }
}

async function onUnblockConfirm() {
    const u = user.value
    if (!u || blockActionBusy.value) return
    blockActionBusy.value = true
    try {
        await unblockUser(u.id)
        await loadUser()
        isUnblockModalOpen.value = false
        toastSuccess("Conta desbloqueada", "O utilizador pode voltar a iniciar sessão.")
    } catch (e) {
        toastFromListMutationError(e, { mode: "save" })
    } finally {
        blockActionBusy.value = false
    }
}

function formatCampaignPeriod(start: string, end: string): string {
    const s = formatSettingsDateOnly(start)
    const e = formatSettingsDateOnly(end)
    if (s === "-" && e === "-") return "-"
    if (s === e) return s
    return `${s} – ${e}`
}

function attendanceLabel(value: boolean | null): string {
    if (value === true) return "Presente"
    if (value === false) return "Ausente"
    return "-"
}

onMounted(() => {
    if (!profile?.value?.isAdmin) {
        void router.replace({ name: "settings-profile" })
    }
})

watch(
    () => profile?.value?.isAdmin,
    (isAdmin) => {
        if (isAdmin === false) {
            void router.replace({ name: "settings-profile" })
        }
    },
)
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6 pb-10">
        <div class="flex flex-col gap-4">
            <Button type="button" variant="secondary" class="w-fit" @click="goBack">← Voltar à lista</Button>
            <div v-if="user" class="flex min-w-0 flex-wrap items-center justify-between gap-4">
                <div class="flex min-w-0 items-center gap-4">
                <div
                    v-if="avatarSrc"
                    class="size-14 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200"
                >
                    <img :src="avatarSrc" alt="" class="size-full object-cover" />
                </div>
                <div
                    v-else
                    class="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-semibold text-blue-700 ring-1 ring-blue-100"
                >
                    {{ avatarInitials }}
                </div>
                <div class="min-w-0">
                    <h3 class="truncate text-xl font-semibold leading-8 text-neutral-950">{{ user.name }}</h3>
                    <div class="mt-1 flex flex-wrap items-center gap-2">
                        <ApiStateBadge v-bind="userAccountStateBadge(user.isBlocked)" />
                        <span class="text-sm leading-5 text-neutral-600">{{ userRoleLabel(user) }}</span>
                    </div>
                </div>
                </div>
                <div v-if="!isSelf" class="flex shrink-0 flex-wrap gap-2">
                    <Button
                        v-if="!user.isBlocked"
                        type="button"
                        variant="danger"
                        :disabled="blockActionBusy"
                        @click="isBlockModalOpen = true"
                    >
                        Bloquear conta
                    </Button>
                    <Button
                        v-else
                        type="button"
                        variant="secondary"
                        :disabled="blockActionBusy"
                        @click="isUnblockModalOpen = true"
                    >
                        Desbloquear conta
                    </Button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-sm leading-5 text-neutral-600">A carregar…</div>
        <p v-else-if="error" class="text-sm leading-5 text-red-600">{{ error }}</p>

        <template v-else-if="user">
            <div class="flex min-h-0 flex-1 flex-col gap-6">
                <AnimatedTabBar ariaLabel="Secções do utilizador" class="min-w-0 shrink-0 -mx-1 px-1">
                    <RouterLink
                        v-for="tab in SETTINGS_USER_DETAILS_TABS"
                        :key="tab.id"
                        v-slot="{ isActive, href, navigate }"
                        :to="tabRoute(tab.id)"
                        custom
                    >
                        <AnimatedTabTrigger
                            :id="`user-details-tab-${tab.id}`"
                            as="a"
                            role="tab"
                            :href="href"
                            :active="isActive"
                            :aria-controls="`user-details-panel-${tab.id}`"
                            @click="navigate"
                        >
                            {{ tab.label }}
                        </AnimatedTabTrigger>
                    </RouterLink>
                </AnimatedTabBar>

                <div
                    class="flex min-h-0 flex-col"
                    :class="activeTab === 'informacao' ? '' : 'min-h-0 flex-1'"
                >
            <div
                v-if="activeTab === 'informacao'"
                id="user-details-panel-informacao"
                role="tabpanel"
                aria-labelledby="user-details-tab-informacao"
                class="flex flex-col gap-6"
            >
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="card in metricCards"
                        :key="card.label"
                        class="rounded-xl border border-neutral-200 bg-white px-4 py-3"
                    >
                        <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">{{ card.label }}</p>
                        <p class="mt-1 text-2xl font-semibold leading-8 text-neutral-950">{{ card.value }}</p>
                    </div>
                </div>

                <dl class="grid gap-3 sm:grid-cols-2">
                    <div v-for="row in detailRows" :key="row.label" class="min-w-0">
                        <dt class="text-xs font-medium uppercase tracking-wide text-neutral-500">{{ row.label }}</dt>
                        <dd class="mt-0.5 text-sm leading-5 text-neutral-950 break-words">{{ row.value }}</dd>
                    </div>
                </dl>

                <div v-if="!isSelf" class="flex max-w-md flex-col gap-1 border-t border-neutral-200 pt-4 pb-8">
                    <FieldLabel for="user-details-role">Cargo na plataforma</FieldLabel>
                    <Select
                        id="user-details-role"
                        v-model="selectedRole"
                        class="w-full"
                        :options="roleOptions"
                        :disabled="savingRole"
                        placeholder="Seleccionar cargo"
                    />
                    <div class="pt-2">
                        <Button type="button" :disabled="!canSaveRole" @click="saveRole(false)">
                            {{ savingRole ? "A guardar…" : "Guardar cargo" }}
                        </Button>
                    </div>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'participacoes'"
                id="user-details-panel-participacoes"
                role="tabpanel"
                aria-labelledby="user-details-tab-participacoes"
                class="flex min-h-0 flex-1 flex-col"
            >
                <div v-if="registrationsLoading" class="text-sm leading-5 text-neutral-600">A carregar participações…</div>
                <p v-else-if="registrationsTotal === 0" class="text-sm leading-5 text-neutral-600">
                    Este utilizador ainda não participou em campanhas.
                </p>
                <ScrollableTableSection v-else fill-container>
                    <DataTableScrollWrap>
                        <table class="w-full min-w-[920px] table-fixed border-collapse text-left">
                            <thead class="sticky top-0 z-10 bg-white">
                                <tr class="border-b border-neutral-200">
                                    <DataTableTh>Campanha</DataTableTh>
                                    <DataTableTh>Período</DataTableTh>
                                    <DataTableTh>Estado da campanha</DataTableTh>
                                    <DataTableTh>Inscrição</DataTableTh>
                                    <DataTableTh>Função</DataTableTh>
                                    <DataTableTh :padding-end="false">Presença</DataTableTh>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="row in registrations"
                                    :key="row.id"
                                    class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                                >
                                    <DataTableTd emphasis>
                                        <RouterLink
                                            v-if="row.campaign"
                                            :to="{
                                                name: 'campaign-details',
                                                params: { campaignId: row.campaign.id, tab: 'informacoes' },
                                            }"
                                            class="text-blue-600 hover:underline"
                                        >
                                            {{ row.campaign.title }}
                                        </RouterLink>
                                        <span v-else>-</span>
                                    </DataTableTd>
                                    <DataTableTd>
                                        {{
                                            row.campaign
                                                ? formatCampaignPeriod(row.campaign.startDate, row.campaign.endDate)
                                                : "-"
                                        }}
                                    </DataTableTd>
                                    <DataTableTd :truncate="false">
                                        <ApiStateBadge
                                            v-if="row.campaign"
                                            v-bind="campaignDetailUiStatusTableBadge(row.campaign.status)"
                                        />
                                        <span v-else>-</span>
                                    </DataTableTd>
                                    <DataTableTd :truncate="false">
                                        <ApiStateBadge v-bind="registrationStatusTableBadge(row.status)" />
                                    </DataTableTd>
                                    <DataTableTd :truncate="false">
                                        <ApiStateBadge v-bind="registrationRoleTableBadge(row.role)" />
                                    </DataTableTd>
                                    <DataTableTd :padding-end="false">{{ attendanceLabel(row.attendance) }}</DataTableTd>
                                </tr>
                            </tbody>
                        </table>
                    </DataTableScrollWrap>
                    <template #footer>
                        <ListPaginationBar
                            :page="registrationsPage"
                            :page-size="tabPageSize"
                            :total="registrationsTotal"
                            @prev="goRegistrationsPrev"
                            @next="goRegistrationsNext"
                        />
                    </template>
                </ScrollableTableSection>
            </div>

            <div
                v-else-if="activeTab === 'organizadas'"
                id="user-details-panel-organizadas"
                role="tabpanel"
                aria-labelledby="user-details-tab-organizadas"
                class="flex min-h-0 flex-1 flex-col"
            >
                <div v-if="organizedLoading" class="text-sm leading-5 text-neutral-600">A carregar campanhas…</div>
                <p v-else-if="organizedTotal === 0" class="text-sm leading-5 text-neutral-600">
                    Este utilizador ainda não organizou campanhas.
                </p>
                <ScrollableTableSection v-else fill-container>
                    <DataTableScrollWrap>
                        <table class="w-full min-w-[720px] table-fixed border-collapse text-left">
                            <thead class="sticky top-0 z-10 bg-white">
                                <tr class="border-b border-neutral-200">
                                    <DataTableTh>Campanha</DataTableTh>
                                    <DataTableTh>Período</DataTableTh>
                                    <DataTableTh :padding-end="false">Estado</DataTableTh>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="row in organizedCampaigns"
                                    :key="row.id"
                                    class="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                                >
                                    <DataTableTd emphasis>
                                        <RouterLink
                                            :to="{
                                                name: 'campaign-details',
                                                params: { campaignId: row.id, tab: 'informacoes' },
                                            }"
                                            class="text-blue-600 hover:underline"
                                        >
                                            {{ row.title }}
                                        </RouterLink>
                                    </DataTableTd>
                                    <DataTableTd>{{ formatCampaignPeriod(row.startDate, row.endDate) }}</DataTableTd>
                                    <DataTableTd :padding-end="false" :truncate="false">
                                        <ApiStateBadge v-bind="campaignDetailUiStatusTableBadge(row.status)" />
                                    </DataTableTd>
                                </tr>
                            </tbody>
                        </table>
                    </DataTableScrollWrap>
                    <template #footer>
                        <ListPaginationBar
                            :page="organizedPage"
                            :page-size="tabPageSize"
                            :total="organizedTotal"
                            @prev="goOrganizedPrev"
                            @next="goOrganizedNext"
                        />
                    </template>
                </ScrollableTableSection>
            </div>
                </div>
            </div>
        </template>

        <BlockUserModal
            v-if="user"
            v-model="isBlockModalOpen"
            :user-display-name="user.name"
            @confirm="onBlockConfirm"
        />
        <UnblockUserModal
            v-if="user"
            v-model="isUnblockModalOpen"
            :user-display-name="user.name"
            @confirm="onUnblockConfirm"
        />
    </div>
</template>
