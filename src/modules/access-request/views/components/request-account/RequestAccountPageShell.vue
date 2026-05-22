<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import { routePaths } from "@/app/router"
</script>

<template>
    <div class="min-h-screen bg-white text-neutral-950">
        <header class="sticky top-0 z-50 select-none border-b border-neutral-200 bg-white/80 backdrop-blur">
            <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
                <RouterLink :to="routePaths.home" class="flex items-center gap-2">
                    <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
                </RouterLink>
                <nav class="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
                    <RouterLink :to="routePaths.campaigns" class="hover:text-neutral-950">Campanhas</RouterLink>
                    <RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950">
                        Solicitar acesso
                    </RouterLink>
                    <RouterLink :to="routePaths.login" class="hover:text-neutral-950">Entrar</RouterLink>
                </nav>
                <div class="flex items-center gap-2 md:hidden">
                    <RouterLink :to="routePaths.login">
                        <Button variant="secondary" class="w-auto">Entrar</Button>
                    </RouterLink>
                </div>
            </div>
        </header>

        <main class="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pt-14">
            <slot />
        </main>

        <footer class="border-t border-neutral-200 bg-white">
            <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
                <div class="flex items-center gap-2 text-sm font-semibold">
                    <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" />
                    <span class="font-normal text-neutral-500">© Mariva — 2026</span>
                </div>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
                    <a href="#" class="hover:text-neutral-950">Termos de serviço</a>
                    <a href="#" class="hover:text-neutral-950">Política de privacidade</a>
                </div>
            </div>
        </footer>
    </div>
</template>
