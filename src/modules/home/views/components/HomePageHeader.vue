<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import { routePaths } from "@/app/router"

defineProps<{
    primaryCtaPath: string
    primaryCtaLabel: string
}>()
</script>

<template>
    <header class="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
        <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <RouterLink :to="routePaths.home" class="flex items-center gap-2">
                <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
            </RouterLink>

            <div class="flex items-center gap-4 sm:gap-6">
                <RouterLink :to="primaryCtaPath">
                    <Button class="min-w-[5.5rem]">{{ primaryCtaLabel }}</Button>
                </RouterLink>
            </div>
        </div>
    </header>
</template>
