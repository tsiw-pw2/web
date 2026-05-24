<script setup lang="ts">
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"

withDefaults(
    defineProps<{
        hint?: string
    }>(),
    {
        hint: "Verifica a ligação e tenta outra vez.",
    },
)

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <ResourceErrorState title="Não foi possível carregar as praias." :hint="hint" action-label="Tentar novamente" @retry="emit('retry')" />
</template>

