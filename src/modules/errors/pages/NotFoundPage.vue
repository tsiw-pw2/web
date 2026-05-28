<script setup lang="ts">
import { computed, onMounted } from "vue"
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { useIsAuthenticated } from "@/composables/useIsAuthenticated"
import { canAccessDashboard } from "@/modules/auth/lib/accessPolicy"
import Button from "@/shared/components/ui/Button.vue"

const isAuthenticated = useIsAuthenticated()
const { profile, loadProfile } = useCurrentProfile()

onMounted(() => {
    if (isAuthenticated.value) {
        void loadProfile()
    }
})

const homeTarget = computed(() => {
    if (!isAuthenticated.value) return routePaths.home
    return canAccessDashboard(profile.value) ? routePaths.dashboard : routePaths.campaigns
})

const homeLabel = computed(() => {
    if (!isAuthenticated.value) return "Ir para a página inicial"
    return canAccessDashboard(profile.value) ? "Ir para o dashboard" : "Ir para campanhas"
})
</script>

<template>
    <div class="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <p class="text-sm font-medium uppercase tracking-wide text-neutral-500">404</p>
        <h1 class="mt-2 text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Página não encontrada</h1>
        <p class="mt-3 max-w-md text-sm leading-6 text-neutral-600">
            O endereço que procuras não existe ou deixou de estar disponível. Verifica o URL ou regressa ao painel principal.
        </p>
        <RouterLink :to="homeTarget" class="mt-6 inline-flex">
            <Button type="button" class="touch-manipulation">{{ homeLabel }}</Button>
        </RouterLink>
    </div>
</template>
