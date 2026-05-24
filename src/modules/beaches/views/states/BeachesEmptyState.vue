<script setup lang="ts">
import ResourceEmptyState from "@/shared/components/states/ResourceEmptyState.vue"
import { useCanManageCatalog } from "@/modules/auth/composables/useCanManageCatalog"

const emit = defineEmits<{
    create: []
}>()

const { canManage } = useCanManageCatalog()
</script>

<template>
    <ResourceEmptyState
        v-if="canManage"
        title="Sem praias."
        hint="Adiciona uma praia para usar nas campanhas."
        action-label="Nova praia"
        @action="emit('create')"
    />
    <ResourceEmptyState
        v-else
        title="Sem praias."
        hint="Ainda não há praias registadas."
    />
</template>
