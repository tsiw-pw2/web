<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import LegalFooterLinks from "@/modules/legal/components/LegalFooterLinks.vue"

defineProps<{
    title: string
}>()
</script>

<template>
    <div class="min-h-screen bg-white text-neutral-950">
        <header class="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
            <div class="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4">
                <RouterLink :to="routePaths.home" class="flex items-center gap-2">
                    <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
                </RouterLink>
                <RouterLink :to="routePaths.home" class="text-sm font-medium text-neutral-600 hover:text-neutral-950">
                    Voltar ao início
                </RouterLink>
            </div>
        </header>

        <main class="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
            <h1 class="text-2xl font-semibold leading-8 text-neutral-950 sm:text-3xl">{{ title }}</h1>
            <div class="mt-8 space-y-8 text-sm leading-6 text-neutral-700">
                <slot />
            </div>
        </main>

        <footer class="border-t border-neutral-200 bg-neutral-50">
            <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-neutral-500">© Mariva</p>
                <LegalFooterLinks />
            </div>
        </footer>
    </div>
</template>
