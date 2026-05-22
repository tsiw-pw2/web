<script setup lang="ts">
import type { CampaignDetails } from "@/modules/campaigns/types/details"
import CampaignBeachesMap from "@/modules/campaigns/views/components/CampaignBeachesMap.vue"

defineProps<{
    campaign: CampaignDetails
    mapActive: boolean
}>()
</script>

<template>
    <div
        id="campaign-panel-praias"
        role="tabpanel"
        aria-labelledby="campaign-tab-praias"
        class="flex flex-col gap-4"
    >
                    >

                        <div v-if="campaign.beaches.length === 0" class="text-sm leading-5 text-neutral-600">
                            Sem praias associadas.
                        </div>

                        <CampaignBeachesMap
                            v-else
                            :beaches="campaign.beaches"
                        />

                    </div>
                    <div
    </motion>
</template>
