<script setup lang="ts">
import { RouterLink } from "vue-router"
import { routePaths } from "@/app/router"
import LogoMark from "@/shared/components/icons/LogoMark.vue"
import UserMenuDropdown from "@/shared/components/layout/UserMenuDropdown.vue"
import NavigationButton from "./NavigationButton.vue"
</script>

<template>

    <header class="relative z-50 shrink-0 select-none">

        <div class="flex h-16 items-center">

            <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4">
                 <RouterLink :to="routePaths.dashboard" class="inline-flex shrink-0" aria-label="Início"> <LogoMark class="size-7" /> </RouterLink>
                <nav class="hidden items-center gap-2 md:flex" aria-label="Principal">
                     <NavigationButton :to="routePaths.dashboard">Dashboard</NavigationButton> <NavigationButton :to="routePaths.campaigns" :active-route-names="['campaigns', 'campaign-details']"
                        > Campanhas </NavigationButton
                    > <NavigationButton :to="routePaths.beaches">Praias</NavigationButton> <NavigationButton :to="routePaths.waste">Resíduos</NavigationButton> <NavigationButton
                        :to="routePaths.settingsProfile"
                        :active-route-names="['settings-profile', 'settings-users']"
                        >Definições</NavigationButton
                    >
                </nav>
                 <UserMenuDropdown />
            </div>

        </div>

    </header>

</template>

