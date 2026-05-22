<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

const emit = defineEmits<{
    create: []
}>()
</script>

<template> <ResourceEmptyState title="Sem categorias de material." hint="Define entradas para registar o que foi recolhido." action-label="Nova categoria" @action="emit('create')" /> </template>

