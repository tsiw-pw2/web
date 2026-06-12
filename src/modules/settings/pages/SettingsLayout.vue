<script setup lang="ts">
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import {
    canAccessSettingsOrgAdmin,
    canAccessSettingsOrganizations,
    canAccessSettingsWasteCategories,
} from "@/modules/auth/lib/accessPolicy"
import { ANIMATED_TAB_BAR_KEY } from "@/shared/composables/useAnimatedTabIndicator"
import { inject, nextTick, provide, watch } from "vue"
import { RouterLink, RouterView, useRoute } from "vue-router"
import { routePaths } from "@/app/router"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"
import ResourceErrorState from "@/shared/components/states/ResourceErrorState.vue"
import AnimatedTabBar from "@/shared/components/ui/tabs/AnimatedTabBar.vue"
import AnimatedTabTrigger from "@/shared/components/ui/tabs/AnimatedTabTrigger.vue"

const route = useRoute()
const { profile, loading: profileLoading, error: profileError, loadProfile } = useCurrentProfile()

provide(settingsProfileKey, profile)

const tabBar = inject(ANIMATED_TAB_BAR_KEY, null)

void loadProfile()

watch(
    () => [
        profile.value?.isRoot,
        profile.value?.isOrgAdmin,
        profile.value?.role,
        profileLoading.value,
    ],
    () => {
        void nextTick(() => tabBar?.updateIndicator())
    },
)

function isSettingsTabActive(name: string): boolean {
    if (name === "settings-users") {
        return route.name === "settings-users" || route.name === "settings-user-details"
    }
    return route.name === name
}
</script>

<template>
    <div class="flex w-full flex-col gap-6 min-h-0 flex-1">
        <h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Definições</h2>

        <div v-if="profileLoading" class="text-sm leading-5 text-neutral-600">A carregar…</div>

        <ResourceErrorState
            v-else-if="profileError"
            class="py-8"
            title="Não foi possível carregar as definições"
            :hint="profileError"
            action-label="Tentar novamente"
            @retry="loadProfile({ force: true })"
        />

        <div v-else class="flex w-full flex-col gap-6 min-h-0 flex-1">
            <AnimatedTabBar ariaLabel="Secções de definições">
                <RouterLink v-slot="{ isActive, href, navigate }" :to="routePaths.settingsProfile" custom>
                    <AnimatedTabTrigger
                        id="settings-tab-profile"
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isActive"
                        @click="navigate"
                    >
                        Perfil
                    </AnimatedTabTrigger>
                </RouterLink>
                <RouterLink v-slot="{ isActive, href, navigate }" :to="routePaths.settingsSecurity" custom>
                    <AnimatedTabTrigger
                        id="settings-tab-security"
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isActive"
                        @click="navigate"
                    >
                        Segurança
                    </AnimatedTabTrigger>
                </RouterLink>
                <RouterLink
                    v-if="canAccessSettingsWasteCategories(profile)"
                    v-slot="{ isActive, href, navigate }"
                    :to="routePaths.settingsWasteCategories"
                    custom
                >
                    <AnimatedTabTrigger
                        id="settings-tab-waste-categories"
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isActive"
                        @click="navigate"
                    >
                        Categorias de resíduos
                    </AnimatedTabTrigger>
                </RouterLink>
                <RouterLink
                    v-if="canAccessSettingsOrgAdmin(profile)"
                    v-slot="{ href, navigate }"
                    :to="routePaths.settingsUsers"
                    custom
                >
                    <AnimatedTabTrigger
                        id="settings-tab-users"
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isSettingsTabActive('settings-users')"
                        @click="navigate"
                    >
                        Equipa
                    </AnimatedTabTrigger>
                </RouterLink>
                <RouterLink
                    v-if="canAccessSettingsOrganizations(profile)"
                    v-slot="{ isActive, href, navigate }"
                    :to="routePaths.settingsOrganizations"
                    custom
                >
                    <AnimatedTabTrigger
                        id="settings-tab-organizations"
                        as="a"
                        role="tab"
                        :href="href"
                        :active="isActive"
                        @click="navigate"
                    >
                        Organizações
                    </AnimatedTabTrigger>
                </RouterLink>
            </AnimatedTabBar>

            <RouterView class="w-full min-h-0 flex-1" />
        </div>
    </div>
</template>
