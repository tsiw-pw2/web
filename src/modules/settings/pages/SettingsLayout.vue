<script setup lang="ts">
import { provide, ref } from "vue"
import { RouterLink, RouterView } from "vue-router"
import { routePaths } from "@/app/router"
import { fetchProfile } from "@/modules/settings/services/profile"
import type { SettingsProfile } from "@/modules/settings/types/profile"
import { setProfileSummaryCache } from "@/infrastructure/profileAvatarCache"
import { settingsProfileKey } from "@/modules/settings/settingsInjection"

const profile = ref<SettingsProfile | null>(null)
const profileLoading = ref(true)
const profileError = ref<string | null>(null)

provide(settingsProfileKey, profile)

async function loadInitialData() {
    profileLoading.value = true
    profileError.value = null
    try {
        const p = await fetchProfile()
        profile.value = p
        setProfileSummaryCache({ avatarUrl: p.avatarUrl ?? null, name: p.name })
    } catch {
        profile.value = null
        profileError.value = "Não foi possível carregar o perfil. Confirma que tens sessão iniciada."
    } finally {
        profileLoading.value = false
    }
}

void loadInitialData()
</script>

<template>
    <div class="flex min-h-0 flex-1 flex-col gap-6">
        <h2 class="text-xl font-semibold leading-8 text-neutral-950 sm:text-2xl">Definições</h2>

        <div v-if="profileLoading" class="text-sm leading-5 text-neutral-600">A carregar…</div>

        <p v-else-if="profileError" class="text-sm leading-5 text-red-600">{{ profileError }}</p>

        <div v-else class="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
            <div role="tablist" aria-label="Secções de definições" class="-mx-1 flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-neutral-200 px-1 pb-px">
                <RouterLink
                    id="settings-tab-profile"
                    role="tab"
                    :to="routePaths.settingsProfile"
                    class="relative shrink-0 -mb-px whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                    :class="
                        $route.name === 'settings-profile'
                            ? 'text-neutral-950 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500'
                            : 'text-neutral-500 hover:text-neutral-800'
                    "
                >
                    Perfil
                </RouterLink>
                <RouterLink
                    id="settings-tab-users"
                    role="tab"
                    :to="routePaths.settingsUsers"
                    class="relative shrink-0 -mb-px whitespace-nowrap px-4 pb-3 pt-1 text-sm font-medium outline-none transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
                    :class="
                        $route.name === 'settings-users'
                            ? 'text-neutral-950 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-500'
                            : 'text-neutral-500 hover:text-neutral-800'
                    "
                >
                    Utilizadores
                </RouterLink>
            </div>

            <RouterView class="flex min-h-0 min-w-0 flex-1 flex-col" />
        </div>
    </div>
</template>
