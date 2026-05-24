<script setup lang="ts">
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"

defineProps<{
    usersError: string | null
    usersLoading: boolean
}>()

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <ResourceErrorState
        v-if="usersError"
        class="py-6"
        title="Não foi possível carregar os utilizadores"
        :hint="usersError"
        action-label="Tentar novamente"
        @retry="emit('retry')"
    />
    <p v-else-if="usersLoading" class="text-sm leading-5 text-neutral-600">A carregar utilizadores…</p>
</template>
