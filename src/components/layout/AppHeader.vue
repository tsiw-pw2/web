<script setup lang="ts">
import NavigationButton from "../ui/NavigationButton.vue"
import { Button } from "../ui/button"
import { routePaths } from "../../app/router"
import { useAuth } from "../../composables/useAuth"
import { useRouter } from "vue-router"

const { isAuthenticated, userName, logout } = useAuth()
const router = useRouter()

async function onLogout() {
    await logout()
    await router.push(routePaths.login)
}
</script>

<template>
    <header class="flex h-16 items-center">
        <div class="mx-auto flex w-full max-w-[1056px] items-center justify-between gap-4 px-4">
            <router-link to="/">
                <img src="/logo.svg" alt="Logo" class="size-8 select-none" />
            </router-link>
            <nav class="flex flex-wrap items-center gap-2">
                <template v-if="isAuthenticated">
                    <NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton>
                    <NavigationButton :to="routePaths.campanhas">Campanhas</NavigationButton>
                    <NavigationButton :to="routePaths.praias">Praias</NavigationButton>
                    <NavigationButton :to="routePaths.residuos">Resíduos</NavigationButton>
                    <NavigationButton :to="routePaths.definicoes">Definições</NavigationButton>
                </template>
            </nav>

            <div class="flex items-center gap-2">
                <template v-if="isAuthenticated">
                    <span class="hidden max-w-[140px] truncate text-xs font-medium text-neutral-300 sm:inline">{{
                        userName
                    }}</span>
                    <Button variant="outline" size="sm" class="border-neutral-600 text-neutral-200" @click="onLogout">
                        Sair
                    </Button>
                </template>
                <template v-else>
                    <router-link
                        :to="routePaths.login"
                        class="select-none rounded-md px-3 py-1.5 text-sm font-medium text-neutral-200 hover:bg-neutral-800"
                    >
                        Entrar
                    </router-link>
                </template>
            </div>
        </div>
    </header>
</template>
