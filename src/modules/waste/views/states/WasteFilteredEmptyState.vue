<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

const emit = defineEmits<{
    clearFilters: []
}>()
</script>

<template>
    <ResourceEmptyState
        title="Nenhum resíduo com estes filtros."
        hint="Ajusta a pesquisa ou limpa os filtros para ver todo o catálogo."
        action-label="Limpar filtros"
        @action="emit('clearFilters')"
    />
</template>
