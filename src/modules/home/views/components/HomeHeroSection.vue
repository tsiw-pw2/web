<script setup lang="ts">
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import { routePaths } from "@/app/router"
import { usePublicSiteNav } from "@/shared/composables/usePublicSiteNav"

const { primaryCtaPath, primaryCtaLabel } = usePublicSiteNav()
</script>

<template>
    <section class="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <div class="max-w-2xl">
            <h1 class="text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                Organize e participe em
                <br />
                campanhas de limpeza de praias.
            </h1>
            <p class="mt-4 max-w-xl text-base leading-6 text-neutral-600 sm:text-lg sm:leading-7">
                Uma plataforma simples para criar, gerir e participar em campanhas ambientais em todo o país.
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <RouterLink :to="primaryCtaPath" class="w-full sm:w-auto">
                    <Button class="w-full sm:w-auto">{{ primaryCtaLabel }}</Button>
                </RouterLink>
                <RouterLink :to="routePaths.campaigns" class="w-full sm:w-auto">
                    <Button class="w-full sm:w-auto" variant="secondary">Ver campanhas</Button>
                </RouterLink>
            </div>
        </div>
    </section>
</template>
