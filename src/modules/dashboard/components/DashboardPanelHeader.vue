<script setup lang="ts">import type { RouteLocationRaw } from "vue-router"


const props = withDefaults(
    defineProps<{
        title: string
        moreHref?: string
        moreTo?: string | RouteLocationRaw
        moreLabel?: string
    }>(),
    {
        moreLabel: "Ver mais",
    },
)
</script>

<template>
    <div class="flex min-w-0 items-center justify-between gap-2">
        <div class="flex min-w-0 flex-1 items-center gap-1">
            <slot name="icon" />
            <p class="min-w-0 truncate text-base font-medium leading-6 text-neutral-950">{{ title }}</p>
        </div>
        <RouterLink
            v-if="props.moreTo"
            class="shrink-0 font-medium text-neutral-400 underline decoration-1 underline-offset-4 decoration-neutral-400 hover:text-neutral-600 hover:decoration-neutral-600"
            :to="props.moreTo"
        >
            {{ props.moreLabel }}
        </RouterLink>
        <a
            v-else-if="props.moreHref"
            class="shrink-0 font-medium text-neutral-400 underline decoration-1 underline-offset-4 decoration-neutral-400 hover:text-neutral-600 hover:decoration-neutral-600"
            :href="props.moreHref"
        >
            {{ props.moreLabel }}
        </a>
    </div>
</template>
