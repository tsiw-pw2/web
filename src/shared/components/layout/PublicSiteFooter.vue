<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { usePublicSiteNav } from "@/shared/composables/usePublicSiteNav"

const { primaryCtaPath, primaryCtaLabel } = usePublicSiteNav()

const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="border-t border-neutral-200 bg-neutral-50">
        <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <RouterLink :to="routePaths.home" class="flex items-center gap-2">
                    <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
                </RouterLink>
                <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-neutral-700">
                    <RouterLink :to="routePaths.campaigns" class="hover:text-neutral-950">Campanhas</RouterLink>
                    <RouterLink :to="primaryCtaPath" class="hover:text-neutral-950">{{ primaryCtaLabel }}</RouterLink>
                </nav>
            </div>
            <div
                class="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
            >
                <p>© Mariva - {{ currentYear }}</p>
                <nav class="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <RouterLink :to="routePaths.terms" class="hover:text-neutral-800">Termos de serviço</RouterLink>
                    <RouterLink :to="routePaths.privacy" class="hover:text-neutral-800">Política de privacidade</RouterLink>
                </nav>
            </div>
        </div>
    </footer>
</template>
