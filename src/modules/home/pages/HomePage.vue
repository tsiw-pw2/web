<script setup lang="ts">
import { computed, onMounted } from "vue"
import { RouterLink } from "vue-router"
import Button from "@/shared/components/ui/Button.vue"
import { routePaths } from "@/app/router"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { useIsAuthenticated } from "@/composables/useIsAuthenticated"
import { canAccessDashboard } from "@/modules/auth/lib/accessPolicy"
import LegalFooterLinks from "@/modules/legal/components/LegalFooterLinks.vue"

const isAuthenticated = useIsAuthenticated()
const { profile, loadProfile } = useCurrentProfile()

onMounted(() => {
    if (isAuthenticated.value) {
        void loadProfile()
    }
})

const primaryCtaPath = computed(() => {
    if (!isAuthenticated.value) return routePaths.login
    return canAccessDashboard(profile.value) ? routePaths.dashboard : routePaths.campaigns
})

const primaryCtaLabel = computed(() => {
    if (!isAuthenticated.value) return "Entrar"
    return canAccessDashboard(profile.value) ? "Dashboard" : "Campanhas"
})
</script>

<template>

    <div class="min-h-screen bg-white text-neutral-950">

        <header class="sticky top-0 z-50 select-none bg-white/80 backdrop-blur">

            <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">

                <div class="flex items-center gap-2"> <img src="/Logo_text.svg" alt="Mariva" class="h-8 w-auto" /> </div>

                <nav class="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
                     <RouterLink :to="routePaths.campaigns" class="hover:text-neutral-950">Campanhas</RouterLink> <RouterLink :to="routePaths.requestAccount" class="hover:text-neutral-950"
                        >Solicitar acesso</RouterLink
                    > <RouterLink :to="primaryCtaPath" class="hover:text-neutral-950">{{ primaryCtaLabel }}</RouterLink>
                </nav>

                <div class="flex items-center gap-2 md:hidden">
                     <RouterLink :to="primaryCtaPath"> <Button variant="secondary" class="w-auto">{{ primaryCtaLabel }}</Button> </RouterLink>
                </div>

            </div>

        </header>

        <section class="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:pt-16">

            <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">

                <div>

                    <h1 class="text-3xl font-semibold leading-tight sm:text-4xl"> Organize e participe em <br /> campanhas de limpeza de praias. </h1>

                    <p class="mt-4 max-w-prose text-sm leading-6 text-neutral-600"> Uma plataforma simples para criar, gerir e participar em campanhas ambientais em todo o país. </p>

                    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <RouterLink :to="primaryCtaPath" class="w-full sm:w-auto">
                            <Button class="w-full sm:w-auto">{{ primaryCtaLabel }}</Button>
                        </RouterLink>
                        <RouterLink v-if="!isAuthenticated" :to="routePaths.register" class="w-full sm:w-auto">
                            <Button class="w-full sm:w-auto" variant="secondary">Criar conta</Button>
                        </RouterLink>
                        <RouterLink :to="routePaths.campaigns" class="w-full sm:w-auto">
                            <Button class="w-full sm:w-auto" variant="secondary">Ver campanhas</Button>
                        </RouterLink>
                    </div>

                </div>

            </div>

        </section>

        <footer class="border-t border-neutral-200">
            <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-neutral-500">© Mariva</p>
                <LegalFooterLinks />
            </div>
        </footer>

    </div>

</template>
