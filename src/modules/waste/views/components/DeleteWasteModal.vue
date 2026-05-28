<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    wasteName?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-waste-title"
        title="Eliminar Resíduo"
        :resource-name="wasteName"
        message="Tem a certeza que pretende eliminar este tipo de resíduo? Esta ação é irreversível e não poderá voltar atrás!"
        confirm-label="Eliminar Resíduo"
        @confirm="emit('confirm')"
    />
</template>
