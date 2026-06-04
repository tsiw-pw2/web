<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
    userDisplayName?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()

// Fecha o modal ou painel.
function close() {
    open.value = false
}

// Confirma a acção de eliminação ou bloqueio.
function onConfirm() {
    emit("confirm")
    close()
}
</script>

<template>
     <ModalRoot v-model="open" ariaLabelledby="unblock-user-title" max-width="md"
        >
        <div class="flex items-start justify-between gap-4">

            <div class="min-w-0">

                <h3 id="unblock-user-title" class="text-sm font-semibold leading-5 text-neutral-950"> Desbloquear utilizador </h3>

                <div v-if="props.userDisplayName" class="mt-1 text-xs leading-4 text-neutral-500"> {{ props.userDisplayName }} </div>

            </div>
             <ModalCloseButton @click="close" />
        </div>

        <p class="text-sm font-semibold leading-5 text-neutral-950"> Tens a certeza que pretendes repor o acesso desta conta? O motivo de bloqueio anterior será limpo na base de dados. </p>

        <div class="flex items-center justify-end gap-2">
             <Button type="button" variant="secondary" @click="close">Cancelar</Button> <Button type="button" @click="onConfirm">Desbloquear</Button>
        </div>
         </ModalRoot
    >
</template>

