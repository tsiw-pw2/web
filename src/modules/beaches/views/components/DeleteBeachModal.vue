<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    beachName?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-beach-title"
        title="Eliminar Praia"
        :resource-name="beachName"
        message="Tem a certeza que pretende eliminar esta praia? Esta ação é irreversível e não poderá voltar atrás!"
        confirm-label="Eliminar Praia"
        @confirm="emit('confirm')"
    />
</template>
