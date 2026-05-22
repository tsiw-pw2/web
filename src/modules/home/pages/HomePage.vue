<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import { routePaths } from "@/app/router"
</script>

<template>

    <div class="min-h-screen bg-white text-neutral-950">

        <header class="sticky top-0 z-50 select-none bg-white/80 backdrop-blur">

            <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">

                <div class="flex items-center gap-2"> <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" /> </div>

                <nav class="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
                     <RouterLink :to="routePaths.campaigns" class="hover:text-neutral-950">Campanhas</RouterLink> <RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950"
                        >Solicitar acesso</RouterLink
                    > <RouterLink :to="routePaths.login" class="hover:text-neutral-950">Entrar</RouterLink>
                </nav>

                <div class="flex items-center gap-2 md:hidden">
                     <RouterLink :to="routePaths.login"> <Button variant="secondary" class="w-auto">Entrar</Button> </RouterLink>
                </div>

            </div>

        </header>

        <section class="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:pt-16">

            <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">

                <div>

                    <h1 class="text-3xl font-semibold leading-tight sm:text-4xl"> Organize e participe em <br /> campanhas de limpeza de praias. </h1>

                    <p class="mt-4 max-w-prose text-sm leading-6 text-neutral-600"> Uma plataforma simples para criar, gerir e participar em campanhas ambientais em todo o país. </p>

                    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                         <RouterLink :to="routePaths.login" class="w-full sm:w-auto"> <Button class="w-full sm:w-auto">Entrar</Button> </RouterLink> <Button
                            class="w-full sm:w-auto"
                            variant="secondary"
                            >Ver campanhas</Button
                        >
                    </div>

                </div>

            </div>

        </section>

    </div>

</template>

