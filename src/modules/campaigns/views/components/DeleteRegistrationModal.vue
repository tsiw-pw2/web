<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    volunteerName?: string
    busy?: boolean
}>()

function close() {
    open.value = false
}

const emit = defineEmits<{
    confirm: []
}>()

function onConfirm() {
    emit("confirm")
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="delete-registration-title" max-width="md">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
                <h3 id="delete-registration-title" class="text-sm font-semibold leading-5 text-neutral-950">
                    Remover inscrição
                </h3>
                <div v-if="props.volunteerName" class="mt-1 text-xs leading-4 text-neutral-500">
                    {{ props.volunteerName }}
                </div>
            </div>
            <ModalCloseButton @click="close" />
        </div>

        <p class="text-sm leading-5 text-neutral-700">
            Tens a certeza que queres remover esta inscrição? O voluntário deixa de constar na lista desta campanha.
        </p>

        <div class="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" :disabled="busy" @click="close">Voltar</Button>
            <Button type="button" variant="danger" :busy="busy" :disabled="busy" @click="onConfirm">Remover</Button>
        </div>
    </ModalRoot>
</template>
