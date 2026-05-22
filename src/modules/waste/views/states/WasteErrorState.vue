<script setup lang="ts">
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"

const emit = defineEmits<{
    retry: []
}>()
</script>

<template> <ResourceErrorState title="Não foi possível carregar os resíduos." hint="Verifica a ligação e tenta outra vez." action-label="Tentar novamente" @retry="emit('retry')" /> </template>

