<script setup lang="ts">
defineProps<{
    usersError: string | null
    usersLoading: boolean
}>()
</script>

<template>
    <p v-if="usersError" class="text-sm leading-5 text-red-600">{{ usersError }}</p>
    <p v-else-if="usersLoading" class="text-sm leading-5 text-neutral-600">A carregar utilizadores…</p>
</template>
