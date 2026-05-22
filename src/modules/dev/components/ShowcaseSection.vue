<script setup lang="ts">
defineProps<{
    id: string
    title: string
    description?: string
}>()
</script>

<template>
     <section :id="id" class="scroll-mt-24 border-b border-neutral-200 py-10 last:border-b-0">
         <h2 class="text-lg font-semibold leading-6 text-neutral-950">{{ title }}</h2>
        <p v-if="description" class="mt-1 max-w-2xl text-sm leading-5 text-neutral-600">{{ description }}</p>
        <div class="mt-6 flex flex-col gap-6">
            <slot />
        </div>
    </section>
</template>
