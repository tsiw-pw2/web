<script setup lang="ts">import type { RouteLocationRaw } from "vue-router"

import DashboardPanel from "@/modules/dashboard/components/DashboardPanel.vue"
import CampaignIcon from "@/shared/components/icons/dashboard/DashboardCampaignIcon.vue"
import CoastIcon from "@/shared/components/icons/dashboard/DashboardCoastIcon.vue"
import VolunteerIcon from "@/shared/components/icons/dashboard/DashboardVolunteerIcon.vue"

defineProps<{
    campaignCount: number
    beachCount: number
    volunteerCount: number
    campaignsTo: string | RouteLocationRaw
    beachesTo: string | RouteLocationRaw
    volunteersTo: string | RouteLocationRaw
}>()

const iconClass = "size-5 shrink-0 text-neutral-500"
</script>

<template>
    <DashboardPanel class="h-full">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <RouterLink
                :to="campaignsTo"
                class="group flex min-w-0 items-start gap-3 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
            >
                <CampaignIcon :class="iconClass" />
                <div class="min-w-0 flex-1">
                    <p class="text-base font-medium leading-6 text-neutral-950 group-hover:text-neutral-700">Campanhas</p>
                    <p class="text-[32px] font-medium leading-10 text-neutral-950 tabular-nums">{{ campaignCount }}</p>
                </div>
            </RouterLink>
            <RouterLink
                :to="beachesTo"
                class="group flex min-w-0 items-start gap-3 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 sm:border-x sm:border-neutral-200 sm:px-6"
            >
                <CoastIcon :class="iconClass" />
                <div class="min-w-0 flex-1">
                    <p class="text-base font-medium leading-6 text-neutral-950 group-hover:text-neutral-700">Praias</p>
                    <p class="text-[32px] font-medium leading-10 text-neutral-950 tabular-nums">{{ beachCount }}</p>
                </div>
            </RouterLink>
            <RouterLink
                :to="volunteersTo"
                class="group flex min-w-0 items-start gap-3 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
            >
                <VolunteerIcon :class="iconClass" />
                <div class="min-w-0 flex-1">
                    <p class="text-base font-medium leading-6 text-neutral-950 group-hover:text-neutral-700">Voluntários</p>
                    <p class="text-[32px] font-medium leading-10 text-neutral-950 tabular-nums">{{ volunteerCount }}</p>
                </div>
            </RouterLink>
        </div>
    </DashboardPanel>
</template>
