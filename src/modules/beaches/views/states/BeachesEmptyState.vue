<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"

const emit = defineEmits<{
    create: []
}>()
</script>

<template> <ResourceEmptyState title="Sem praias." hint="Adiciona uma praia para usar nas campanhas." action-label="Nova praia" @action="emit('create')" /> </template>

