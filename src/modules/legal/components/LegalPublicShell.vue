<script setup lang="ts">
import PublicPageShell from "@/shared/components/layout/PublicPageShell.vue"

defineProps<{
    title: string
}>()
</script>

<template>
    <PublicPageShell :title="title" narrow>
        <div class="space-y-8 text-sm leading-6 text-neutral-700">
            <slot />
        </div>
    </PublicPageShell>
</template>
