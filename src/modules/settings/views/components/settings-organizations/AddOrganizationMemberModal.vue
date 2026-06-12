<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { OrganizationListItem, OrganizationMemberCreateDraft } from "@/modules/settings/services/organizations"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    organization: OrganizationListItem | null
}>()

const emit = defineEmits<{
    create: [payload: OrganizationMemberCreateDraft]
}>()

const name = ref("")
const email = ref("")
const password = ref("")
const birthDate = ref("")
const phone = ref("")

const canSubmit = computed(() => {
    return (
        name.value.trim().length > 0 &&
        email.value.trim().length > 0 &&
        password.value.length >= 8 &&
        birthDate.value.trim().length > 0
    )
})

function close() {
    open.value = false
}

function reset() {
    name.value = ""
    email.value = ""
    password.value = ""
    birthDate.value = ""
    phone.value = ""
}

function onSubmit() {
    if (!canSubmit.value) return
    emit("create", {
        name: name.value,
        email: email.value,
        password: password.value,
        birthDate: birthDate.value,
        phone: phone.value,
    })
    close()
}

watch(open, (isOpen) => {
    if (isOpen) reset()
})
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="add-organization-member-title">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h3 id="add-organization-member-title" class="text-lg font-semibold leading-7 text-neutral-950">
                    Nova conta de organizador
                </h3>
                <p v-if="organization" class="mt-1 text-sm text-neutral-600">{{ organization.name }}</p>
            </div>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-1">
                <FieldLabel required>Nome</FieldLabel>
                <Input v-model="name" class="w-full" placeholder="Nome do responsável" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel required>Email</FieldLabel>
                <Input v-model="email" type="email" class="w-full" placeholder="ambiente@municipio.pt" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel required>Palavra-passe inicial</FieldLabel>
                <Input v-model="password" type="password" class="w-full" placeholder="Mínimo 8 caracteres" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel required>Data de nascimento</FieldLabel>
                <Input v-model="birthDate" type="date" class="w-full" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel>Telefone</FieldLabel>
                <Input v-model="phone" type="tel" class="w-full" placeholder="Opcional" />
            </div>
            <div class="mt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!canSubmit">Criar conta</Button>
            </div>
        </form>
    </ModalRoot>
</template>
