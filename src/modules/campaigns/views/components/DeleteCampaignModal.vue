<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    campaignTitle?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-campaign-title"
        title="Eliminar Campanha"
        :resource-name="campaignTitle"
        message="Tem a certeza que pretende eliminar esta campanha? Esta ação é irreversível e não poderá voltar atrás!"
        confirm-label="Apagar Campanha"
        @confirm="emit('confirm')"
    />
</template>
