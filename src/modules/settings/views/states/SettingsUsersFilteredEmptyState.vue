<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

defineProps<{
    role: string
}>()

const emit = defineEmits<{
    clearFilter: []
}>()
</script>

<template>
    <ResourceEmptyState
        title="Nenhum utilizador com este filtro."
        :hint="`O cargo «${role}» não é válido. Escolhe outro filtro ou consulta a lista completa.`"
        action-label="Ver todos os utilizadores"
        @action="emit('clearFilter')"
    />
</template>
