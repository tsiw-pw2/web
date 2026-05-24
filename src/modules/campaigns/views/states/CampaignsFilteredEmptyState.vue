<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

const emit = defineEmits<{
    clearFilters: []
}>()
</script>

<template>
    <ResourceEmptyState
        title="Nenhuma campanha com estes filtros."
        hint="Ajusta a pesquisa ou limpa os filtros para ver todas as campanhas."
        action-label="Limpar filtros"
        @action="emit('clearFilters')"
    />
</template>
