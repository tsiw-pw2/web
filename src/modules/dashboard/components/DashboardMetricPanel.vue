<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { RouteLocationRaw } from "vue-router"
import DashboardPanel from "./DashboardPanel.vue"
import DashboardPanelHeader from "./DashboardPanelHeader.vue"

const props = defineProps<{
    title: string
    value: string
    class?: HTMLAttributes["class"]
    moreHref?: string
    moreTo?: string | RouteLocationRaw
    moreLabel?: string
}>()
</script>

<template>
     <DashboardPanel :class="props.class"
        > <DashboardPanelHeader :title="title" :more-href="moreHref" :more-to="moreTo" :more-label="moreLabel"
            > <template #icon> <slot name="icon" /> </template> </DashboardPanelHeader
        >
        <h6 class="text-[32px] font-medium leading-10 text-neutral-950">{{ value }}</h6>
         </DashboardPanel
    >
</template>

