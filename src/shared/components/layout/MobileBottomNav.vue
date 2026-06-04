<script setup lang="ts">
import type { Component } from "vue"
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { routePaths } from "@/app/router"
import { useCurrentProfile } from "@/composables/useCurrentProfile"
import { canAccessDashboard } from "@/modules/auth/lib/accessPolicy"
import MobileNavBeachesIcon from "@/shared/components/icons/mobile-nav/MobileNavBeachesIcon.vue"
import MobileNavCampaignsIcon from "@/shared/components/icons/mobile-nav/MobileNavCampaignsIcon.vue"
import MobileNavDashboardIcon from "@/shared/components/icons/mobile-nav/MobileNavDashboardIcon.vue"
import MobileNavSettingsIcon from "@/shared/components/icons/mobile-nav/MobileNavSettingsIcon.vue"
import MobileNavWasteIcon from "@/shared/components/icons/mobile-nav/MobileNavWasteIcon.vue"

defineOptions({ name: "MobileBottomNav" })

const route = useRoute()
const { profile, loadProfile } = useCurrentProfile()

const allTabs: {
    to: string
    names: readonly string[]
    label: string
    icon: Component
    requiresDashboard?: boolean
}[] = [
    {
        to: routePaths.dashboard,
        names: ["dashboard"],
        label: "Dashboard",
        icon: MobileNavDashboardIcon,
        requiresDashboard: true,
    },
    {
        to: routePaths.campaigns,
        names: ["campaigns", "campaign-details"],
        label: "Campanhas",
        icon: MobileNavCampaignsIcon,
    },
    {
        to: routePaths.beaches,
        names: ["beaches"],
        label: "Praias",
        icon: MobileNavBeachesIcon,
    },
    {
        to: routePaths.waste,
        names: ["waste"],
        label: "Resíduos",
        icon: MobileNavWasteIcon,
    },
    {
        to: routePaths.settingsProfile,
        names: ["settings-profile", "settings-security", "settings-users", "settings-user-details", "settings-waste-categories"],
        label: "Definições",
        icon: MobileNavSettingsIcon,
    },
]

const tabs = computed(() => {
    const canDashboard = canAccessDashboard(profile.value)
    return allTabs.filter((tab) => !tab.requiresDashboard || canDashboard)
})

onMounted(() => {
    void loadProfile()
})

// Verifica se a rota está activa.
function isActive(names: readonly string[]) {
    return names.includes(route.name as string)
}
</script>

<template>

    <nav class="flex w-full shrink-0 select-none items-stretch border-t border-neutral-900 bg-neutral-950 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden" aria-label="Navegação principal">
         <RouterLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="flex min-h-0 min-w-0 flex-1 flex-col justify-stretch px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            :aria-current="isActive(tab.names) ? 'page' : undefined"
            :aria-label="tab.label"
            > <span
                class="flex min-h-0 w-full flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium leading-5 transition-colors hover:shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_1px_2px_0_rgba(10,10,10,0.24)] hover:text-white"
                :class="isActive(tab.names) ? 'bg-white/8 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_1px_2px_0_rgba(10,10,10,0.24)]' : 'text-neutral-400 hover:bg-white/8'"
                > <component :is="tab.icon" aria-hidden="true" /> </span
            > </RouterLink
        >
    </nav>

</template>
