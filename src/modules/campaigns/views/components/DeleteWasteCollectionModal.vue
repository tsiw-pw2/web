<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    summary?: string
    busy?: boolean
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-waste-collection-title"
        title="Apagar recolha"
        :resource-name="summary"
        message="Tens a certeza que queres apagar este registo? Os totais da campanha serão atualizados."
        confirm-label="Apagar"
        cancel-label="Voltar"
        :busy="busy"
        :close-on-confirm="false"
        @confirm="emit('confirm')"
    />
</template>
