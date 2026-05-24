<script setup lang="ts">
import type { CampaignDetailsBeach } from "@/modules/campaigns/types/details"
import BeachesMap from "@/shared/components/BeachesMap.vue"

defineProps<{
    beaches: CampaignDetailsBeach[]
}>()
</script>

<template>
    <BeachesMap
        :points="beaches"
        aria-label="Mapa das praias da campanha"
    />
</template>
