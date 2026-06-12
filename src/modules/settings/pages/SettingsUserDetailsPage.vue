<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { useSettingsUserDetails } from "@/modules/settings/composables/settings-user-details/useSettingsUserDetails"
import { formatSettingsDateOnly, formatSettingsDateTime } from "@/modules/settings/lib/formatSettingsDate"
import { SETTINGS_USER_DETAILS_TABS, settingsUserDetailsTabFromRoute, type SettingsUserDetailsTabId, } from "@/modules/settings/lib/settingsUserDetailsTabs"
import { profileIsOrgAdmin } from "@/modules/auth/lib/profileCapabilities"
import { SETTINGS_USER_ROLE_OPTIONS } from "@/modules/settings/lib/settingsUserRole"
import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
import { blockUser, unblockUser } from "@/modules/settings/services/settingsUsers"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import BlockUserModal from "@/modules/settings/views/components/BlockUserModal.vue"
import UnblockUserModal from "@/modules/settings/views/components/UnblockUserModal.vue"
import { toastFromListMutationError } from "@/infrastructure/apiMutationToast"
import { toastSuccess } from "@/infrastructure/appToast"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { userAccountStateBadge } from "@/shared/lib/apiStatePresentation"
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

const roleOptions = SETTINGS_USER_ROLE_OPTIONS.filter((o) =>
    o.value === "organizer" || o.value === "orgAdmin",
).map((o) => ({ value: o.value, label: o.label }))

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

onMounted(() => {
    if (!profileIsOrgAdmin(profile?.value)) {
        void router.replace({ name: "settings-profile" })
    }
})

watch(
    () => profileIsOrgAdmin(profile?.value),
    (allowed) => {
        if (!allowed) {
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
            <AnimatedTabBar ariaLabel="Secções do utilizador" class="-mx-1 px-1">
                <RouterLink
                    v-for="tab in SETTINGS_USER_DETAILS_TABS"
                    :key="tab.id"
                    v-slot="{ isActive, href, navigate }"
                    :to="tabRoute(tab.id)"
                    custom
                >
                    <AnimatedTabTrigger
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isActive"
                        @click="navigate"
                    >
                        {{ tab.label }}
                    </AnimatedTabTrigger>
                </RouterLink>
            </AnimatedTabBar>

            <div v-if="activeTab === 'informacao'" class="flex flex-col gap-6">
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
                        <Button
                            type="button"
                            :disabled="!canSaveRole"
                            @click="saveRole(isSelf && (user?.isOrgAdmin === true || user?.role === 'orgAdmin'))"
                        >
                            {{ savingRole ? "A guardar…" : "Guardar cargo" }}
                        </Button>
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
