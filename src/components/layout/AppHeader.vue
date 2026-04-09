<script setup lang="ts">
import NavigationButton from "../ui/NavigationButton.vue"
import { routePaths } from "../../app/router"
</script>

<template>

    <header class="flex h-16 items-center">

        <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4">
             <a href="/"> <img src="/logo.svg" alt="Logo" class="size-8" /> </a>
            <nav class="flex items-center gap-2">
                 <NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton> <NavigationButton :to="routePaths.campanhas">Campanhas</NavigationButton> <NavigationButton
                    :to="routePaths.praias"
                    >Praias</NavigationButton
                > <NavigationButton :to="routePaths.residuos">Resíduos</NavigationButton> <NavigationButton :to="routePaths.definicoes">Definições</NavigationButton>
            </nav>

            <div class="size-8 rounded-full bg-neutral-800"></div>

        </div>

    </header>

</template>

