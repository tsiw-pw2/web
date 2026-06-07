<script setup lang="ts">
import { ref, watch } from "vue"
import type { CampaignDetailsRegistration } from "@/modules/campaigns/types/details"
import type { PatchRegistrationBody } from "@/modules/campaigns/services/campaignRegistrations"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"
import Select from "@/shared/components/ui/select/Select.vue"
import { REGISTRATION_ROLE_ITEMS, REGISTRATION_STATUS_ITEMS } from "@/shared/lib/apiStatePresentation"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    registration: CampaignDetailsRegistration | null
    saving?: boolean
}>()

const emit = defineEmits<{
    save: [body: PatchRegistrationBody]
}>()

const status = ref<string | undefined>(undefined)
const role = ref<string | undefined>(undefined)
const attendance = ref<string | undefined>(undefined)

const statusOptions = REGISTRATION_STATUS_ITEMS.filter((i) => i.value !== 0).map((i) => ({
    value: String(i.value),
    label: i.label,
}))

const roleOptions = REGISTRATION_ROLE_ITEMS.map((i) => ({
    value: String(i.value),
    label: i.label,
}))

const attendanceOptions = [
    { value: "unset", label: "Por marcar" },
    { value: "true", label: "Presente" },
    { value: "false", label: "Ausente" },
]

// Fecha o modal ou painel.
function close() {
    open.value = false
}

// Preenche o formulário com os dados da inscrição.
function applyRegistration(r: CampaignDetailsRegistration | null) {
    if (!r) {
        status.value = undefined
        role.value = undefined
        attendance.value = undefined
        return
    }
    status.value = String(r.status)
    role.value = String(r.role)
    if (r.attendance === null) attendance.value = "unset"
    else attendance.value = r.attendance ? "true" : "false"
}

watch(
    () => props.registration,
    (r) => applyRegistration(r),
    { immediate: true },
)

watch(open, (isOpen) => {
    if (isOpen) applyRegistration(props.registration)
})

// Guarda os dados do formulário.
function onSave() {
    const body: PatchRegistrationBody = {
        status: Number(status.value),
        role: Number(role.value),
    }
    if (attendance.value === "unset") body.attendance = null
    else if (attendance.value === "true") body.attendance = true
    else if (attendance.value === "false") body.attendance = false
    emit("save", body)
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="edit-registration-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="edit-registration-title" class="text-lg font-semibold leading-7 text-neutral-950">
                Gerir inscrição
            </h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onSave">
            <div class="flex flex-col gap-1">
                <FieldLabel class="block" for="edit-reg-status">Estado</FieldLabel>
                <Select
                    id="edit-reg-status"
                    v-model="status"
                    class="w-full min-w-0"
                    :options="statusOptions"
                    placeholder="Estado"
                />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel class="block" for="edit-reg-role">Função</FieldLabel>
                <Select
                    id="edit-reg-role"
                    v-model="role"
                    class="w-full min-w-0"
                    :options="roleOptions"
                    placeholder="Função"
                />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel class="block" for="edit-reg-attendance">Presença</FieldLabel>
                <Select
                    id="edit-reg-attendance"
                    v-model="attendance"
                    class="w-full min-w-0"
                    :options="attendanceOptions"
                    placeholder="Presença"
                />
            </div>

            <div class="flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" :disabled="saving" @click="close">Cancelar</Button>
                <Button type="submit" variant="primary" :busy="saving" :disabled="saving">Guardar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
