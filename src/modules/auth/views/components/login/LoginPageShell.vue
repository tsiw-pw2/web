<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"

withDefaults(
    defineProps<{
        contentMaxWidth?: string
    }>(),
    {
        contentMaxWidth: "max-w-sm",
    },
)

const footerLinkClass =
    "text-neutral-500 font-medium text-sm leading-5 hover:text-neutral-700"
</script>

<template>
    <div class="flex min-h-screen flex-col bg-white text-neutral-950">
        <header class="flex shrink-0 justify-center px-4 py-6 sm:px-6">
            <RouterLink :to="routePaths.home" class="inline-flex items-center">
                <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
            </RouterLink>
        </header>

        <main
            class="mx-auto flex w-full flex-1 flex-col justify-center px-4 pb-12 sm:px-6"
            :class="contentMaxWidth"
        >
            <div class="w-full px-px">
                <slot />
            </div>
        </main>

        <footer class="shrink-0 px-4 py-6 sm:px-6">
            <div class="relative mx-auto flex w-full max-w-6xl items-center justify-center">
                <p class="text-center text-neutral-500 font-medium text-sm leading-5">© Mariva</p>
                <nav
                    class="absolute right-0 flex flex-wrap items-center justify-end gap-x-6 gap-y-2"
                    aria-label="Documentos legais"
                >
                    <RouterLink :to="routePaths.terms" :class="footerLinkClass">
                        Termos de serviço
                    </RouterLink>
                    <RouterLink :to="routePaths.privacy" :class="footerLinkClass">
                        Política de privacidade
                    </RouterLink>
                </nav>
            </div>
        </footer>
    </div>
</template>
