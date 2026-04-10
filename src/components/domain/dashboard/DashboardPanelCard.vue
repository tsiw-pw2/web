<script setup lang="ts">
import { RouterLink } from "vue-router"

defineProps<{
    title: string
    moreTo?: string
}>()
</script>

<template>
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div class="flex items-start justify-between gap-4 px-4 pt-4">
            <h2 class="text-base font-semibold leading-6 text-neutral-950">{{ title }}</h2>
            <RouterLink
                v-if="moreTo"
                :to="moreTo"
                class="shrink-0 text-sm font-medium leading-5 text-neutral-500 hover:text-neutral-700"
            >
                Ver mais →
            </RouterLink>
        </div>
        <div class="p-4 pt-3">
            <slot />
        </div>
    </div>
</template>
