<script setup lang="ts">
import Button from "@/shared/components/ui/Button.vue"
import ModalCloseButton from "@/shared/components/ui/ModalCloseButton.vue"
import ModalRoot from "@/shared/components/ui/ModalRoot.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    deleteCategoryName?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()

function close() {
    open.value = false
}

function onConfirm() {
    emit("confirm")
    close()
}
</script>

<template>
    <ModalRoot v-model="open" ariaLabelledby="delete-waste-category-title" max-width="md">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
                <h3 id="delete-waste-category-title" class="text-sm font-semibold leading-5 text-neutral-950">
                    Eliminar categoria
                </h3>
                <div v-if="deleteCategoryName" class="mt-1 text-xs leading-4 text-neutral-500">
                    {{ deleteCategoryName }}
                </div>
            </div>
            <ModalCloseButton @click="close" />
        </div>
        <p class="text-sm font-semibold leading-5 text-neutral-950">
            Tens a certeza? Só podes eliminar categorias que não estejam associadas a resíduos.
        </p>
        <div class="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" @click="close">Cancelar</Button>
            <Button type="button" variant="danger" @click="onConfirm">Eliminar</Button>
        </div>
    </ModalRoot>
</template>
