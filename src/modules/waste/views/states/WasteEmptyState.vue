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
        title="Sem registos de resíduo."
        hint="Cria o primeiro para associar material recolhido nas campanhas."
        action-label="Criar resíduo"
        @action="emit('create')"
    />
    <ResourceEmptyState
        v-else
        title="Sem registos de resíduo."
        hint="Ainda não há resíduos no catálogo."
    />
</template>
