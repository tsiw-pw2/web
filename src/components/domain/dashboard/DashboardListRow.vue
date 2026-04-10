<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <div class="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-b-0">
        <span class="text-sm font-medium leading-5 text-neutral-600">{{ label }}</span>
        <div class="text-right text-sm font-semibold leading-5 text-neutral-950">
            <slot />
        </div>
    </div>
</template>
