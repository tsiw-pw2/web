<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { OrganizationUpsertDraft } from "@/modules/settings/services/organizations"
import Button from "@/shared/components/ui/Button.vue"
import FieldLabel from "@/shared/components/ui/FieldLabel.vue"
import Input from "@/shared/components/ui/Input.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
    create: [payload: OrganizationUpsertDraft]
}>()

const name = ref("")
const municipality = ref("")
const contactEmail = ref("")

const canSubmit = computed(() => name.value.trim().length > 0 && municipality.value.trim().length > 0)

function close() {
    open.value = false
}

function reset() {
    name.value = ""
    municipality.value = ""
    contactEmail.value = ""
}

function onSubmit() {
    if (!canSubmit.value) return
    emit("create", {
        name: name.value,
        municipality: municipality.value,
        contactEmail: contactEmail.value,
    })
    close()
}

watch(open, (isOpen) => {
    if (isOpen) reset()
})
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="create-organization-title">
        <div class="flex items-start justify-between gap-4">
            <h3 id="create-organization-title" class="text-lg font-semibold leading-7 text-neutral-950">
                Nova organização
            </h3>
            <ModalCloseButton @click="close" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-1">
                <FieldLabel required>Nome</FieldLabel>
                <Input v-model="name" class="w-full" placeholder="Ex.: Câmara Municipal de …" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel required>Concelho</FieldLabel>
                <Input v-model="municipality" class="w-full" placeholder="Ex.: Vila do Conde" />
            </div>
            <div class="flex flex-col gap-1">
                <FieldLabel>Email de contacto</FieldLabel>
                <Input v-model="contactEmail" type="email" class="w-full" placeholder="ambiente@municipio.pt" />
            </div>
            <div class="mt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" @click="close">Cancelar</Button>
                <Button type="submit" :disabled="!canSubmit">Criar</Button>
            </div>
        </form>
    </ModalRoot>
</template>
