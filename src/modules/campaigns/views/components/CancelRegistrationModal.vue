<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    busy?: boolean
}>()

// Fecha o modal ou painel.
function close() {
    open.value = false
}

const emit = defineEmits<{
    confirm: []
}>()

// Confirma a acção de eliminação ou bloqueio.
function onConfirm() {
    emit("confirm")
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="cancel-registration-title" max-width="md">
        <div class="flex items-start justify-between gap-4">
            <h3 id="cancel-registration-title" class="text-sm font-semibold leading-5 text-neutral-950">
                Cancelar inscrição
            </h3>
            <ModalCloseButton @click="close" />
        </div>

        <p class="text-sm leading-5 text-neutral-700">
            Tens a certeza que queres cancelar a tua inscrição nesta campanha? Podes voltar a inscrever-te mais tarde se
            a campanha ainda estiver aberta.
        </p>

        <div class="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" :disabled="busy" @click="close">Voltar</Button>
            <Button type="button" variant="danger" :busy="busy" :disabled="busy" @click="onConfirm">
                Cancelar inscrição
            </Button>
        </div>
    </ModalRoot>
</template>
