<script setup lang="ts">
defineProps<{
    heading: string
    id?: string
}>()
</script>

<template>
    <section :id="id">
        <h2 class="text-base font-semibold leading-6 text-neutral-950">{{ heading }}</h2>
        <div class="mt-3 space-y-3">
            <slot />
        </div>
    </section>
</template>
