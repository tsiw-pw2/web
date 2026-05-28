<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    deleteCategoryName?: string
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-waste-category-title"
        title="Eliminar categoria"
        :resource-name="deleteCategoryName"
        message="Tens a certeza? Só podes eliminar categorias que não estejam associadas a resíduos."
        confirm-label="Eliminar"
        @confirm="emit('confirm')"
    />
</template>
