<script setup lang="ts">
import ConfirmDeleteModal from "@/shared/components/ui/ConfirmDeleteModal.vue"

const open = defineModel<boolean>({ required: true })

defineProps<{
    volunteerName?: string
    busy?: boolean
}>()

const emit = defineEmits<{
    confirm: []
}>()
</script>

<template>
    <ConfirmDeleteModal
        v-model="open"
        title-id="delete-registration-title"
        title="Remover inscrição"
        :resource-name="volunteerName"
        message="Tens a certeza que queres remover esta inscrição? O voluntário deixa de constar na lista desta campanha."
        confirm-label="Remover"
        cancel-label="Voltar"
        :busy="busy"
        :close-on-confirm="false"
        @confirm="emit('confirm')"
    />
</template>
