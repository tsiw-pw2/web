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
        title="Sem campanhas."
        hint="Cria a primeira para mobilizar equipas nas praias."
        action-label="Criar campanha"
        @action="emit('create')"
    />
    <ResourceEmptyState
        v-else
        title="Sem campanhas."
        hint="Ainda não há campanhas disponíveis."
    />
</template>
