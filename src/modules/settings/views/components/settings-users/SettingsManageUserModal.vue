<script setup lang="ts">
import { computed, inject, ref, watch } from "vue"
import type { SettingsUserRow } from "@/modules/settings/types/settingsUser"
import { formatSettingsDateOnly, formatSettingsDateTime } from "@/modules/settings/lib/formatSettingsDate"
import {
    SETTINGS_USER_ROLE_OPTIONS,
    type SettingsUserRoleKey,
} from "@/modules/settings/lib/settingsUserRole"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import { userRoleLabel } from "@/modules/settings/lib/userRoleLabel"
import { userAccountStateBadge } from "@/shared/lib/apiStatePresentation"
import ApiStateBadge from "@/shared/components/ui/ApiStateBadge.vue"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    user: SettingsUserRow | null
    saving?: boolean
}>()

const emit = defineEmits<{
    save: [payload: { userId: string; role: SettingsUserRoleKey }]
}>()

const profile = inject(settingsProfileKey)

const selectedRole = ref<SettingsUserRoleKey | undefined>(undefined)

const roleOptions = SETTINGS_USER_ROLE_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
}))

const isSelf = computed(() => {
    const me = profile?.value
    const u = props.user
    if (!me || !u) return false
    return me.id === u.id
})

const canChangeRole = computed(() => {
    if (!props.user || props.saving) return false
    if (isSelf.value && props.user.isAdmin) return false
    return selectedRole.value != null && selectedRole.value !== props.user.role
})

const detailRows = computed(() => {
    const u = props.user
    if (!u) return []
    return [
        { label: "Nome", value: u.name },
        { label: "E-mail", value: u.email },
        { label: "Telefone", value: u.phone?.trim() || "—" },
        { label: "Data de nascimento", value: formatSettingsDateOnly(u.birthDate) },
        { label: "Perfil actual", value: userRoleLabel(u) },
        { label: "Registo na plataforma", value: formatSettingsDateTime(u.createdAt) },
        {
            label: "Estado da conta",
            value: u.isBlocked ? "Bloqueada" : "Activa",
        },
        ...(u.isBlocked && u.blockedReason
            ? [{ label: "Motivo do bloqueio", value: u.blockedReason }]
            : []),
        ...(u.isBlocked && u.blockedAt
            ? [{ label: "Bloqueada em", value: formatSettingsDateTime(u.blockedAt) }]
            : []),
    ]
})

function close() {
    open.value = false
}

function applyUser(u: SettingsUserRow | null) {
    selectedRole.value = u?.role
}

watch(
    () => props.user,
    (u) => applyUser(u),
    { immediate: true },
)

watch(open, (isOpen) => {
    if (isOpen) applyUser(props.user)
})

function onSave() {
    const u = props.user
    if (!u || !selectedRole.value || !canChangeRole.value) return
    emit("save", { userId: u.id, role: selectedRole.value })
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="manage-user-title">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
                <h3 id="manage-user-title" class="text-lg font-semibold leading-7 text-neutral-950">Utilizador</h3>
                <p v-if="user" class="mt-1 text-sm leading-5 text-neutral-600">{{ user.name }}</p>
            </div>
            <ModalCloseButton @click="close" />
        </div>

        <template v-if="user">
            <div class="flex flex-wrap items-center gap-2">
                <ApiStateBadge v-bind="userAccountStateBadge(user.isBlocked)" />
                <span class="text-sm leading-5 text-neutral-600">{{ userRoleLabel(user) }}</span>
            </div>

            <dl class="grid gap-3 sm:grid-cols-2">
                <div v-for="row in detailRows" :key="row.label" class="min-w-0">
                    <dt class="text-xs font-medium uppercase tracking-wide text-neutral-500">{{ row.label }}</dt>
                    <dd class="mt-0.5 text-sm leading-5 text-neutral-950 break-words">{{ row.value }}</dd>
                </div>
            </dl>

            <div class="flex flex-col gap-1 border-t border-neutral-200 pt-4">
                <FieldLabel for="manage-user-role">Cargo na plataforma</FieldLabel>
                <Select
                    id="manage-user-role"
                    v-model="selectedRole"
                    class="w-full"
                    :options="roleOptions"
                    :disabled="saving || (isSelf && user.isAdmin)"
                    placeholder="Seleccionar cargo"
                />
                <p v-if="isSelf && user.isAdmin" class="text-sm leading-5 text-neutral-500">
                    Não podes remover o teu próprio acesso de administrador.
                </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" @click="close">Fechar</Button>
                <Button type="button" :disabled="!canChangeRole" @click="onSave">
                    {{ saving ? "A guardar…" : "Guardar cargo" }}
                </Button>
            </div>
        </template>
    </ModalRoot>
</template>
